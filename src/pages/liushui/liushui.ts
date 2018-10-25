import { Component,ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import {FileService} from "../../share/fileService";
import { Storage } from '@ionic/storage';
import {Content } from 'ionic-angular';
@Injectable()

@Component({
  templateUrl: 'liushui.html'
})
export class LiushuiPage {
  @ViewChild(Content) content:Content;
  items = [];
  Pagenum: any;
  myparams = new URLSearchParams();
  startDate: string;
  endDate: string;
  showKey:boolean=true; //防止滚动条事件一直执行
  key:boolean = true;
  constructor(private http: Http, private file:FileService,private storage: Storage) {
  }
  ionViewDidLoad(){
    this.Pagenum = 1;
    this.myparams.set('num', this.Pagenum);
    let params = this.myparams;
    this.file.showLoading();

    this.storage.get('userStorage').then(value => {
      this.myparams.set('un', value.userid);
      this.file.loading.present().then(() => {
        this.http.get(this.file.localUrl + '/action/MondyDetails/Liushui', {params}).toPromise().then(response => {
          this.items = JSON.parse(response.json().data);
          this.file.hideLoading();
        });
      })
    })
  }

  dataSearch() {
    if(this.startDate||this.endDate) {
      this.Pagenum = 1;
      this.myparams.set('sd', this.startDate);
      this.myparams.set('ed', this.endDate);
      this.myparams.set('num', this.Pagenum);
      let params = this.myparams;
      this.file.showLoading();
        this.file.loading.present().then(() => {
          this.http.get(this.file.localUrl + '/action/MondyDetails/Liushui', {params}).toPromise().then(response => {
            this.items = JSON.parse(response.json().data);
            this.file.hideLoading();
            this.key = true;
          });
        })
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
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
  }
  doInfinite(infiniteScroll){
    if (this.key) {
      setTimeout(() => {
        this.Pagenum++;
        this.myparams.set('num', this.Pagenum);
        let params = this.myparams;
        this.http.get(this.file.localUrl + '/action/MondyDetails/Liushui', {params}).toPromise().then(response => {
          let mydata = JSON.parse(response.json().data);
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
