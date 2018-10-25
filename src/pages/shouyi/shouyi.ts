import { Component, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import {ShareModule} from "../../share/share.module";
import {Content } from 'ionic-angular';
import {FileService} from "../../share/fileService";
import { Storage } from '@ionic/storage';

@Injectable()

@Component({
  templateUrl: 'shouyi.html'
})
export class ShouyiPage {
  @ViewChild(Content) content:Content;
  items = [];
  Pagenum:any;
  myparams=new URLSearchParams();
  startDate:string;
  endDate:string;
  showKey:boolean=true; //防止滚动条事件一直执行
  key:boolean = true;
  constructor(
    private http: Http,
    private mydate: ShareModule,
    private file:FileService,
    private storage: Storage
  ) {}
  ionViewDidLoad(){
    this.Pagenum = 1;
    this.myparams.set('num', this.Pagenum);

    let params = this.myparams;
    let today = new Date();
    this.myparams.set('sd', this.mydate.formatDate(today,null));
    this.file.showLoading();
    this.storage.get('userStorage').then(value => {
      this.myparams.set('uid', value.userid);
      this.file.loading.present().then(() => {
        this.http.get(this.file.localUrl +'/action/BonusDetails/GetList', {params}).toPromise().then(response => {
          this.items = response.json();
          this.file.hideLoading()
        });
      })
    })
}
  dataSearch(){
    if(this.startDate||this.endDate) {
      this.Pagenum = 1;
      this.myparams.set('sd', this.startDate);
      this.myparams.set('ed', this.endDate);
      this.myparams.set('num', this.Pagenum);
      let params = this.myparams;
      this.file.showLoading();
      this.file.loading.present().then(() => {
        this.http.get(this.file.localUrl +'/action/BonusDetails/GetList', {params}).toPromise().then(response => {
          this.items = response.json();
          this.file.hideLoading();
          this.key = true;
        });
      })
    }
  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
  }

  newPage(dates){
    // this.nav.push(MondyDetailsPage, {
    //     u:this.myparams.get('uid'),
    //     t: this.mydate.formatDate(dates,false)
    // });
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

  doInfinite(infiniteScroll){
    if (this.key) {
      setTimeout(() => {
        this.Pagenum++;
        this.myparams.set('num', this.Pagenum);
        let params = this.myparams;
        this.http.get(this.file.localUrl +'/action/BonusDetails/GetList', {params}).toPromise().then(response => {
          let mydata = response.json();
          if (mydata.length == 0) {
            this.key = false;
          }else {
            for (let data of mydata) {
              this.items.push(data);
            }
          }
          infiniteScroll.complete();
        });
      }, 800);
    }else{
      infiniteScroll.complete();
    }

  }
}

