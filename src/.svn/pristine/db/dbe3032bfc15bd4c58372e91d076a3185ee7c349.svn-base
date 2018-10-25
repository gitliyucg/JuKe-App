import { Component } from '@angular/core';
import {AlertController, NavController,App} from 'ionic-angular';
import {DiZhiGuanLi} from "../dizhiguanli/dizhiguanli";
import {AnquanPage} from "./anquan";
import {HelplistPage} from "./helplist";
import { Storage } from '@ionic/storage';
import {AboutPage} from "./about";
import {LoginPage} from "../login/login";
@Component({
  templateUrl: '../member/pagelist.html'
})

export class ShezhiPage {
  pageTitle="设置";
  uid:string;
  lists:Array<object> = [
    {name:'收货地址管理',url:DiZhiGuanLi,icon:'shouhuodizhiguanli'},
    {name:'账户与安全',url:AnquanPage,icon:'zhanghuyuanquan'},
    {name:'帮助与反馈',url:HelplistPage,icon:'bangzhuyufankui'},
    {name:'关于剧客',url:AboutPage,icon:'guanyujuke'}
  ];
  constructor(public nav: NavController,private storage: Storage,private alertCtrl:AlertController,private app:App) {
  }
  toNewPage(url){
    this.nav.push(url);
  }
  loginOut(){
    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertClass',
      message: '您确定退出吗？',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: '取消',
          cssClass: 'canBtn',
          handler: () => {
          }
        },
        {
          text: '确定',
          cssClass: 'sureBtn',
          handler: () => {
            this.storage.set('userStorage','');
            this.app.getRootNav().push(LoginPage);
          }
        }
      ]
    });
    confirm.present();

  }
}
