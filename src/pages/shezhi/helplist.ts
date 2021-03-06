import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Http} from "@angular/http";
import {MyhelpPage} from "./myhelp";
import {MyFeedPage} from "./myfeed";
import {App} from "ionic-angular";
import {FileService} from "../../share/fileService";
@Component({
  templateUrl:'helplist.html',
  styles:['.item-block { margin: 0.5rem 0;}']
})

export class HelplistPage {
  items=[];
  items2=[];
  uid:string;
  help: string = "fankui";
  num:number;
  key:boolean=true;
  constructor(
    private http: Http,
    private storage: Storage,
    private app:App,
    private fileService: FileService) {
    this.num=1;
    storage.get('userStorage').then(value => {
      this.uid = value.userid;
      this.http.get(this.fileService.localUrl + '/action/FeedBacks/GetList?un='+this.uid+'&num=1').toPromise().then(response => {
        let mydata = response.json();
        this.items = JSON.parse(mydata.data);

      });
      this.http.get(this.fileService.localUrl + '/action/Helps/GetList').toPromise().then(response => {
        let mydata = response.json();
        this.items2 = JSON.parse(mydata.data);
      });
    })
  }
  wentizhankai(id){
      for(let i=0;i<this.items2.length;i++){
        if(id==this.items2[i].ID){
          if(!this.items2[i].isToggled){
            this.items2[i].value = true;
            this.items2[i].isToggled = true;
          }else if(this.items2[i].isToggled){
            this.items2[i].value = false;
            this.items2[i].isToggled = false;
          }

        }
      }
  }
  myhelp(key){
    if(key=="wenti"){
      this.key = false;
    }else{
      this.key=true;
    }

  }
  myFeedBack(id){
    this.app.getRootNav().push(MyFeedPage,{id:id})
  }
  tohelp(){
    this.app.getRootNav().push(MyhelpPage)
  }
  doInfinite(infiniteScroll) { // 上拉刷新
    if(this.key==true) {
      setTimeout(() => {
        this.num += 1
        this.http.get(this.fileService.localUrl + '/action/FeedBacks/GetList?un=' + this.uid + '&num=' + this.num).subscribe(response => {
          let items2 = JSON.parse(response.json().data);
          if (items2.length == 0) {
            infiniteScroll.enable(false);
          }
          for (let data of items2) {
            this.items.push(data);
          }
          infiniteScroll.complete();
        });
      }, 600);
    }
  }
}
