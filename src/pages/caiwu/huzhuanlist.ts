import { Component,ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {FileService} from "../../share/fileService";
import { Storage } from '@ionic/storage';
import {Content } from 'ionic-angular';
@Injectable()

@Component({
  template:`
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>收益转换记录</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content (ionScroll)="scrollHandler($event)">
      <toTop [viewCon]="content" id="toTop"></toTop>
      <ion-list>
        <ion-item *ngFor="let item of items">
          <ion-row>
            <ion-col>转换时间：{{getTime(item.RecordDate)}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>交易类型：{{item.Reason}}</ion-col>
          </ion-row>
          <ion-row>
            <ion-col>收入：{{item.IncomeSum}}</ion-col>
            <ion-col>支出：{{item.SpendSum}}</ion-col>
            
          </ion-row>
          <ion-row>
            <ion-col>货币类型：{{item.MoneyType}}</ion-col>
            <ion-col>余额：{{item.Balance}}</ion-col>
          </ion-row>
        </ion-item>
      </ion-list>
      <ion-infinite-scroll (ionInfinite)="doInfinite($event)">
        <ion-infinite-scroll-content loadingSpinner="bubbles" loadingText="正在加载..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>`
})
export class HuzhuanlistPage {
  @ViewChild(Content) content:Content;
  items = [];
  uid:string;
  pagenum:number=1;
  showKey:boolean=true; //防止滚动条事件一直执行
  constructor(private http: Http, private file:FileService,private storage: Storage) {}
  ionViewDidLoad() {
    this.file.showLoading();
    this.file.loading.present().then(() => {
      this.storage.get('userStorage').then(value => {
        this.uid = value.userid;
        this.http.get(this.file.localUrl +'/action/DuiHuan/GetList?un=' + this.uid+'&num=' + this.pagenum).subscribe(response => {
          this.items = JSON.parse(response.json().data);
          this.file.hideLoading();
        });
      })
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
  doInfinite(infiniteScroll){

      setTimeout(() => {
        this.pagenum++;
        this.http.get(this.file.localUrl + '/action/Withdrawals/GetList?uid=' + this.uid +'&num=' + this.pagenum).subscribe(response => {
          let mydata = response.json();
          let mydatas = JSON.parse(mydata.data);
          if (mydatas.length == 0) {
            infiniteScroll.enable(false);
          }else {
            for (let data of mydatas) {
              this.items.push(data);
            }
          }
          infiniteScroll.complete();

        });
      }, 500);

  }
}
