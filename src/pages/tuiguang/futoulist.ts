import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {FileService} from "../../share/fileService";
import { Storage } from '@ionic/storage';
@Injectable()

@Component({
  template:`
    <ion-header>
  <ion-navbar>
  <button menuToggle>
  <ion-icon name="menu"></ion-icon>
  </button>
  <ion-title>复投记录</ion-title>
  </ion-navbar>
  </ion-header>
  <ion-content>
<ion-list>
<ion-item *ngFor="let item of items">
  <ion-row>
  <ion-col>复投时间：{{getTime(item.RecordTime)}}</ion-col>
</ion-row>
<ion-row>
<ion-col>会员编号：{{item.UserId}}</ion-col>
<ion-col>报单数：{{item.BaoDanNum}}</ion-col>
</ion-row>
</ion-item>
</ion-list>
  </ion-content>`
})
export class FutouListPage {
  items = [];
  constructor(private http: Http, private file:FileService,private storage: Storage) {}
  ionViewDidLoad() {
    this.file.showLoading();
    this.file.loading.present().then(() => {
      this.storage.get('userStorage').then(value => {
        this.http.get(this.file.localUrl +'/action/TuiGuang/GetFutou?un=' + value.userid).subscribe(response => {
          this.items = response.json();
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

}
