import { Component} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {IndexnavPage} from "../indexnav/indexnav";


@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{successTitle}}</ion-title>
      </ion-toolbar>
      
    </ion-header>
    <ion-content class="successDiv">
      <img src='{{successImg}}' width="30%">
      <button *ngIf="successBtn1" (click)="succBtn()" ion-button block color="gray">{{successBtn1}}</button>
      <button *ngIf="successBtn2" (click)="backToMember()" ion-button block>{{successBtn2}}</button>
    </ion-content>
  `
})
export class SubSuccess {
  successTitle: string = this.navParams.get('successObj').successTitle;
  successImg: string = this.navParams.get('successObj').successImg;
  successBtn1: string = this.navParams.get('successObj').successBtn1 || '';
  successBtn2: string = this.navParams.get('successObj').successBtn2 || '';

  constructor(private navCtrl: NavController, private navParams: NavParams) {
  }
  succBtn() {
      this.navCtrl.pop();
  }
  backToMember(){
    this.navCtrl.push(IndexnavPage,{page:2});
  }
}
