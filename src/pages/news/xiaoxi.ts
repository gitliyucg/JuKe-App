import { Component,ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { App} from "ionic-angular";
import {NewPage} from "./new";
import {FileService} from "../../share/fileService";
import { Storage } from '@ionic/storage';
import {Content } from 'ionic-angular';
@Injectable()



@Component({
	templateUrl: 'xiaoxi.html'
})

export class XiaoxiPage {
  @ViewChild(Content) content:Content;
	items=[];
  Pagenum:number=1;
  uid:string;
  showKey:boolean=true; //防止滚动条事件一直执行
	constructor(private http: Http,private app:App,private fileService:FileService,private storage: Storage) {


	}
  ionViewWillEnter() {
    this.storage.get('userStorage').then(value => {
      this.uid = value.userid;
      this.fileService.showLoading();
      this.fileService.loading.present().then(() => {
        this.http.get(this.fileService.localUrl + '/action/MessageLists/GetList?un=' + this.uid + '&num=1').subscribe(response => {
          let mydata = response.json();
          this.items = JSON.parse(mydata.data);
          this.fileService.hideLoading();
        });
      })
    })
  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }
  deleteX($event,id){
    $event.stopPropagation();
    this.fileService.showLoading();
    this.fileService.loading.present().then(() => {
      this.http.delete(this.fileService.localUrl + '/action/MessageLists/DeleteMessageList/' + id).subscribe(response => {
        for (var i = 0; i < this.items.length; i++) {
          if (id == this.items[i].id) {
            this.items.splice(i, 1);
            this.fileService.hideLoading();
          }
        }
      })
    })

  }
	toNews(item){
    if(item.IsStatu==0){item.IsStatu=1}
    this.http.put(this.fileService.localUrl + '/action/MessageLists/Edit/'+item.id,item).subscribe(res=>{
      this.app.getRootNav().push(NewPage, {id: item.id, type: 'xiaoxi'})
    })
  }
  scrollHandler(event){  //滚动控制返回顶部按钮

    if(this.content.scrollTop>400&&this.showKey){
      this.showKey = false;
      document.getElementById('toTop').style.display="block";

    }else if(this.content.scrollTop<400&&!this.showKey){
      this.showKey = true;
      document.getElementById('toTop').style.display="none";

    }

  }
  doInfinite(infiniteScroll) {

      setTimeout(() => {
        this.Pagenum++;
        this.http.get(this.fileService.localUrl + '/action/MessageLists/GetList?un='+this.uid+'&num='+this.Pagenum ).subscribe(response => {
          let mydata = JSON.parse(response.json().data);
          if (mydata.length == 0) {
            infiniteScroll.enable(false);
          }
          for (let data of mydata) {
            this.items.push(data);
          }
          infiniteScroll.complete();
        });


      }, 800);
  }
}
