import { Component } from '@angular/core';
import {XieyiPage} from "./xieyi";
import { AppVersion } from '@ionic-native/app-version';
import { Platform } from "ionic-angular";
import { Http } from "@angular/http";

@Component({
  template:`
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>关于剧客</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content class="about">
        <div padding style="background: #fff">
          <div padding-bottom style="border-bottom: 1px #d9d9d9 solid"><img src="assets/img/logo.png" width="20%"/></div>
          <p>剧客网是北京华夏金影国际文化传媒有限公司推出的020平台，公司致力于打造国内粉丝经济生态圈，构建以粉丝、会员为核心，明星艺人
            为基础的影视娱乐生态系统，在“互联网+”背景下形成的一种粉丝经济模式。顺应互联网发展及国民娱乐需求，公司利用十余年的资本经验积淀，以
            会员为中心，联合华夏影视联盟，打造粉丝生态圈，提供线上线下全方位的粉丝经济娱乐服务。</p>
        </div>
        <p padding text-center class="icon-ios-deepgray" style="text-align: center; text-indent: 0">当前版本：<span>{{version}}</span></p>
    </ion-content>
    <ion-footer text-center>
      <p class="icon-ios-primary"  [navPush]="pushPage">剧客网软件许可及服务协议</p>
      <p class="icon-ios-deepgray">北京华夏金影国际文化传媒有限公司所有</p>
      <p class="icon-ios-deepgray f12">Copyright @ 2011-2017 Huaxia Jinying All Rights Reserved</p>
    </ion-footer>
  `
})

export class AboutPage {
  pushPage: any = XieyiPage;
  public version: number;
  constructor(
    private platfrom: Platform,
    private http: Http,
    private appVersion: AppVersion
  ) {

    platfrom.ready().then(() => {
      if (platfrom.is("ios")){
        appVersion.getVersionCode().then(value => {
          this.version = value.replace(/\./g,'');
        })
      }
      if (platfrom.is("android")){
        appVersion.getVersionCode().then(value => {
          this.version = parseInt(value);
        })
      }

    })

  }



}
