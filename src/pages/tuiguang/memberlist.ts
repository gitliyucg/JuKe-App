import { Component,ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {JihuoPage} from "./jihuo";
import {FileService} from "../../share/fileService";
import {Content } from 'ionic-angular';
@Injectable()

@Component({
  templateUrl: 'memberlist.html'
})
export class MemberlistPage {
  @ViewChild(Content) content:Content;
  items = [];
  membername: string = '';
  startDate: string = '';
  endDate: string = '';
  pagenum: any;
  un:string;
  showKey:boolean=true; //防止滚动条事件一直执行
  constructor(private http: Http,private storage: Storage,private nav:NavController,private fileService:FileService) {

    }
  ionViewDidLoad() {
    this.storage.get('userStorage').then(value => {
      if (value) {
        this.un = value.userid;
        this.pagenum = 1;
        this.http.get(this.fileService.localUrl +'/action/TuiGuang/MyMember?un='+this.un).subscribe(response => {
          let mydata = response.json();
          this.items = JSON.parse(mydata.data);

        });
      }
    })

  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
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
  dataSearch() {

    let url = '';
    if (this.startDate) { url += '&sd=' + this.startDate; }
    if (this.endDate) { url += '&ed=' + this.endDate; }
    if (this.membername) { url += '&s=' + this.membername; }
    this.pagenum = 1;
    this.http.get(this.fileService.localUrl +'/action/TuiGuang/MyMember?un='+this.un + url + '&num='+this.pagenum ).subscribe(response => {
      let mydata = response.json();
      this.items = JSON.parse(mydata.data);
    });
  }
  doInfinite(infiniteScroll) {
    let url = '';
    if (this.startDate) { url += '&sd=' + this.startDate; }
    if (this.endDate) { url += '&ed=' + this.endDate; }
    if (this.membername) { url += '&s=' + this.membername; }
      setTimeout(() => {
        this.pagenum++;
        this.http.get(this.fileService.localUrl +'/action/TuiGuang/MyMember?un='+this.un + url + '&num=' + this.pagenum).subscribe(response => {
          let mydata = response.json();
          let mydatas = JSON.parse(mydata.data);
          //mydata = JSON.parse(mydata);
          if (mydatas.length == 0) {
            infiniteScroll.enable(false);
          } else {
            for (let data of mydatas) {
              this.items.push(data);
            }
          }
          infiniteScroll.complete();
        });
      }, 500);

  }
  jihuo(item){
    this.nav.push(JihuoPage,{item:item});
  }
}

