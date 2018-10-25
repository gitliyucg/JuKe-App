import { Component } from '@angular/core';
import {Http} from "@angular/http";
import {ShareModule} from "../../share/share.module";
import {NavParams} from "ionic-angular";
@Component({
  template:`
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>个人信息</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-list class='jifen'>
    <ion-item>
      <ion-label>会员账号</ion-label>
      <ion-input value="{{uid}}" readonly="true" color="primary"></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>会员姓名</ion-label>
      <ion-input value="{{username}}" readonly="true" ></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>身份证号码</ion-label>
      <ion-input value="{{userid}}" readonly="true" ></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>手机号码</ion-label>
      <ion-input value="{{mobile}}" readonly="true" ></ion-input>
    </ion-item>
    <ion-item>
      <ion-label>银行类别</ion-label>
      <ion-input value="{{bank}}" readonly="true" ></ion-input>
    </ion-item>
        <ion-item>
          <ion-label>银行账号</ion-label>
          <ion-input value="{{bankAccount}}" readonly="true" ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>银行支行</ion-label>
          <ion-input value="{{bankAddress}}" readonly="true" ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>激活人</ion-label>
          <ion-input value="{{BanDanCenter}}" readonly="true" ></ion-input>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})

export class UserInfo {
  uid:string;
  username:string;
  userid:string;
  mobile:string;
  bank:string;
  bankAccount:string;
  bankAddress:string;
  mydata:any;
  BanDanCenter: string;
  constructor(public http: Http,private share:ShareModule,private navParams:NavParams) {

        this.mydata = this.navParams.get('mydata');;
        this.uid = this.mydata.UserID;
        this.username = this.mydata.Name;
        this.userid = this.share.mask(this.mydata.IDNumber,5,9,'*');
        this.mobile = this.share.mask(this.mydata.Mobile,3,4,'*');
        this.bank = this.mydata.OpeningBank;
        this.bankAccount = this.mydata.BankAccount;
        this.bankAddress = this.mydata.BankZhihang;
        this.BanDanCenter = this.mydata.BanDanCenter;


  }
}
