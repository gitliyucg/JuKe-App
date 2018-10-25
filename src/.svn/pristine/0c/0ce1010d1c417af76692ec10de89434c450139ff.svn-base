import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {MyApp} from "../../app/app.component";

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{successTitle}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="successDiv">
      <img src='{{successImg}}' width="30%">
      <!--p class="kong_tishi" *ngIf="successTitle!='收货成功'">{{successTitle}}</p-->
      <p class="kong_tishi" *ngIf="successMessage">{{successMessage}}</p>
      <button *ngIf="successBtn1" (click)="succBtn(successUrl1)" ion-button block color="gray">{{successBtn1}}</button>
      <button *ngIf="successBtn2" (click)="succBtnTo()" ion-button block>{{successBtn2}}</button>
    </ion-content>
  `
})
export class SubSuccessOrder {

  successTitle: string = this.navParams.get('successObj').successTitle;
  successMessage: string = this.navParams.get('successObj').successMessage;
  successImg: string = this.navParams.get('successObj').successImg;
  successBtn1: string = this.navParams.get('successObj').successBtn1 || '';
  successBtn2: string = this.navParams.get('successObj').successBtn2 || '';
  successUrl1 = this.navParams.get('successObj').successUrl1 || '';
  successUrl2 = this.navParams.get('successObj').successUrl2 || '';

  constructor(private navCtrl: NavController, private navParams: NavParams) {


  }
  succBtn(url) {
    this.navCtrl.push(url);

  }
  succBtnTo(){
    this.navCtrl.push(MyApp);
  }
}
