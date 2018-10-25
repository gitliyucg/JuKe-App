import { Component } from '@angular/core';
import { NavController,AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserInfo } from '../shezhi/userinfo';
import {Http} from "@angular/http";
import {FileService} from "../../share/fileService";
import {PassPage} from "./password";
import {MobilePage} from "../login/mobile";
import {ShareModule} from "../../share/share.module";
@Component({
  template:`
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>账户与安全</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <ion-list>
    <ion-item>
      会员ID　　　　　　{{uerid}}
    </ion-item>
    <button ion-item (click)="toNewPage(item.url)" *ngFor="let item of lists">
      {{item.name}}　　　<span *ngIf="item.con">{{item.con}}</span>
    </button>
      </ion-list>
    </ion-content>
  `
})

export class AnquanPage {
  uerid:string;
  uid:string;
  mobile:string;
  lists:Array<any> = [
    {name:'已绑定手机号',url:'手机',icon:'',con:''},
    {name:'修改登录密码',url:'登录',icon:''},
    {name:'修改二级密码',url:'二级',icon:''},
    {name:'个人信息',url:UserInfo,icon:''}
  ];
  mydata:any;
  constructor(private nav: NavController,
              private storage: Storage,
              private alertCtrl:AlertController,
              private http:Http,
              private fileService: FileService,
              private share:ShareModule) {
    storage.get('userStorage').then(value => {
      this.uid = value.uid;
      this.http.get(this.fileService.localUrl + '/action/Users/GetUser/'+value.uid).toPromise().then(res=>{
        this.mydata = res.json();
        this.uerid = this.mydata.UserID;
        this.mobile = this.share.mask(this.mydata.Mobile,3,4,'*');
        this.lists[0].con = this.mobile;

      })
    })

  }
  toNewPage(url){
    if(typeof(url)=='string'){
      this.showPrompt(url);
    }else{
      this.nav.push(url,{mydata:this.mydata})
    }
  }
  showPrompt(url) {
    let prompt = this.alertCtrl.create({
      title: '登录密码验证',
      message: "为了您的数据安全，我们需要验证您的登录密码",
      inputs: [
        {
          name: 'password',
          type:'password',
          placeholder: '登录密码'
        },
      ],
      buttons: [
        {
          text: '取消',
          cssClass:'fwh'
        },
        {
          text: '确定',
          cssClass:'fwh',
          handler: data => {
            if(data.password){
              this.fileService.showLoading();
              this.fileService.loading.present().then(() => {
                this.http.get(this.fileService.localUrl + '/action/Users/ValidPass?uid=' + this.uid + '&pass=' + data.password).toPromise().then(response => {
                  let mydata = response.json();
                  this.fileService.hideLoading();
                  if (mydata) {
                    if (url == '登录' || url == '二级') {
                      this.nav.push(PassPage, {oldpass: data.password, passType: url});
                    } else if (url == '手机') {
                      this.nav.push(MobilePage, {mobile: this.mydata.Mobile, url: 'mobile', uid: this.uid});
                    }

                  } else {
                    this.alertCtrl.create({
                      title: '密码错误',
                      subTitle: '请输入正确的密码',
                      buttons: ['确定'],
                      cssClass: 'fwh'
                    }).present();

                  }
                });
              })
            }

          }
        }
      ]
    });
    prompt.present();
  }
}
