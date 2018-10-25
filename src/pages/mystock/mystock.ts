import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StockPage } from "../stock/stock";
import { StockchangePage } from "../stockchange/stockchange";
import { StockdistPage } from "../stockdist/stockdist";
import { GuquanPage } from "../guquan/guquan";
import { Storage } from "@ionic/storage";

/**
 * Generated class for the MystockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-mystock',
  templateUrl: '../member/pagelist.html'
})
export class MystockPage {

  public isBaodan: number;

  pageTitle="我的股权";
  lists:Array<object> =[
    {name: '股权收益转换',url: GuquanPage,icon: 'guquanzhuanhuan'},
    {name: '兑换股权积分',url: StockchangePage,icon: 'guquanduihuan'},
    {name: '购买股权',url: StockPage,icon: 'guquangoumai'},
  ]

    constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage
  ) {
  }

  ionViewDidLoad() {

    this.storage.get('userStorage').then( value => {
      this.isBaodan = value['isBaodan'];
      if (this.isBaodan == 1){
        this.lists.push({name: '股权回购分配',url: StockdistPage,icon: 'guquanfenpei'})
      }
    } )

  }

  toNewPage(page){
    this.navCtrl.push(page)
  }

}
