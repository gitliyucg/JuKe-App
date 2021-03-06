import { Component,ViewChild} from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {AlertController, App, NavController, NavParams, Tabs,Platform} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { FindPage } from './find';
import {FileService} from "../../share/fileService";
import {IndexnavPage} from "../indexnav/indexnav";
import {MyApp} from "../../app/app.component";

@Injectable()

@Component({
  selector:'login-page',
  template: `
    <ion-header class="listchild-header" *ngIf="type=='home'">
      <ion-navbar></ion-navbar>
    </ion-header>
    <div class="loginBg">
      <img src="assets/img/logo.png" class="logo" width="20%"/>
      <img src="assets/img/logowelcome.png" class="wel" width="40%"/>
      <form [formGroup]="myForm" (submit)="toLogin()">  
        <ion-list nolines>
          <ion-item>
            <ion-input type="text" placeholder="请输入您的账号" autocomplete="no" formControlName="UserID" [(ngModel)]="UserID" required></ion-input>
          </ion-item>
        </ion-list>
        <ion-list nolines>
          <ion-item>
            <ion-input type="password" placeholder="请输入您的密码" formControlName="pass" [(ngModel)]="pass" required></ion-input>
          </ion-item>
        </ion-list>
        <ion-range no-padding [disabled]="saturation==150" min="0" max="150" [(ngModel)]="saturation" debounce="300" formControlName="saturation" (ionChange)="thisChange($event)">
        </ion-range>
        <div padding-top>
          <button ion-button block [disabled]=myForm.invalid type="submit">登录</button>
        </div>
      </form>
        
      
      <div padding-top>
        <a class="label-ios-gray torepass" (tap)="torePass()">忘记密码</a> 
      </div>
      <!--<div>-->
        <!--<a class="label-ios-gray torepass" (click)="toIndex()">返回首页</a>-->
      <!--</div>-->
    </div>
  `
})


export class LoginPage {
  @ViewChild('myTabs') tabRef:Tabs;
  myForm:FormGroup;
  UserID:string;
  pass:string;
  saturation:number=0;
  tologin:boolean = true;
  type=this.navParams.get('type');
  constructor(public http: Http,
              private alertCtrl:AlertController,
              private formBuilder:FormBuilder,
              private storage: Storage,
              private file:FileService,
              private navParams:NavParams,
              private app:App,
              private nav:NavController,
              private plat:Platform) {

    this.myForm = formBuilder.group({

      UserID:['',Validators.required],
      pass:['',Validators.required],
      saturation:[]

    });


  }
  ionViewWillEnter(){
    this.saturation = 0
  }
  thisChange(){
      if(this.saturation<120){
        this.saturation=0;
      }else if(this.saturation>100){
      this.saturation=150;
    }

  }
  torePass(){
    this.app.getRootNav().push(FindPage)
  }
  toLogin() {


      if (this.saturation != 150) {
        this.alertCtrl.create({
          title: '提示',
          subTitle: '请将滑块拖拽至最右端',
          buttons: ['确定'],
          cssClass: 'fwh'
        }).present();
        return false;
      } else {
        if (this.tologin) {
          this.tologin = false;
        let params = {UserID: this.UserID, pass: this.pass}
        this.http.post(this.file.localUrl + '/action/Login/SignIn2', params).subscribe(data => {
          let mdata = data.json();
          let userStorage = {
            'userid': mdata['UserID'],  //uerid :wqb888
            'uid': mdata['Id'],      //uid: 89
            'isBaodan': mdata['IsBaoDan'], //1是报单中心0不是
            'CID': mdata['CID'],      //CID查出用户配置方案{.."Zhuanhuan":0.00,"WebClose":0,"IsTransfer":1,"IsWithdraw":1}]。action/TuiGuang/GetConf/CID
            'BCenter': mdata['BanDanCenter'],  //报单中心
            'Name': mdata['Name'],  //名字
            'WebClose': mdata['WebClose'],   //1为维护
            'IsTransfer': mdata['IsTransfer'], //1为允许积分互转
            'IsWithdraw': mdata['IsWithdraw'] //1为允许提现
          };
          this.storage.set('userStorage', userStorage);
          if (this.plat.is("android")) {
            this.nav.setRoot(IndexnavPage);
          } else {
            this.app.getRootNav().push(MyApp);
          }
        }, error => {

          if (error.json().Message) {
            this.alertCtrl.create({
              title: '提示',
              subTitle: error.json().Message,
              buttons: ['确定'],
              cssClass: 'fwh'
            }).present();
            this.file.hideLoading();

            //
            return false;
          }

        });

      }
        setTimeout(() => this.tologin = true, 600);
    }

  }
}
