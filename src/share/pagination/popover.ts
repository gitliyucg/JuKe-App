import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  template: `
    <ion-title *ngIf = "title">{{title}}</ion-title>
    <ion-list>
      <button ion-item (click)="toPage(item.id,item.name)" 
      *ngFor="let item of items" text-center detail-none>{{item.name}}</button>
    </ion-list>
  `
})
export class PopovernumPage {
  items = [];
  title: string;
  callback;
  constructor(public viewCtrl: ViewController, private params: NavParams) {
    this.items = this.viewCtrl.data.item;
    this.title = this.viewCtrl.data.title;
    this.callback = this.params.get('cb');
  }
  public toPage(x, y) {
    this.callback(x, y)
    this.close();
  }
  close() {
    this.viewCtrl.dismiss();
  }
}
