import { Component } from '@angular/core';
import { Http } from "@angular/http";
import { NavController, NavParams } from 'ionic-angular';
import { RechargesPage } from "../recharges/recharges";
import { DynamicPage } from "../dynamic/dynamic";
import { ConsumptionPage } from "../consumption/consumption";
import { BaodanPage } from "../caiwu/baodan";
import { App } from "ionic-angular";
import { FileService } from "../../share/fileService";
import { Storage } from "@ionic/storage";
import { BalancePage } from "../balance/balance";
import { GuquanPage } from "../guquan/guquan";
import { StockchangePage } from "../stockchange/stockchange";

/**
 * Generated class
 * the WalletPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {

  public dongtai: number;
  public gouwu: number;

  //点击跳转到相应页面
  public rechargesPage: any = RechargesPage;//天天奖励
  public dynamicPage: any = DynamicPage;//动态奖励
  public consumptionPage: any = ConsumptionPage;//消费积分
  public baodanPage: any = BaodanPage;//报单余额
  public balancePage: any = BalancePage;//结余积分
  public guquanfundPage: any = StockchangePage;//股权积分
  public guquanPage: any = GuquanPage;//股权收益

  public guquanFund: number = 0;//股权积分
  public guquan: number = 0;//股权收益
  public balance: number = 0;//结余积分

  public UID: string;
  public integralArr: any  = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public app: App,
    public fileService: FileService,
    public Storage: Storage
  ) {
  }

  ionViewDidLoad() {

    //获取传过来的动态积分和购物积分
    this.dongtai = this.navParams.get('dongtai');

    //获取UID
    this.Storage.get('userStorage').then( value => {
      this.UID = value['userid'];
      //获取天天奖励，动态奖励，报单金额，结余积分,股权积分
      this.http.get(this.fileService.localUrl + '/action/users/getYue?uid=' + this.UID).subscribe( response => {
        this.integralArr = response.json();
        this.guquanFund = response.json()['GuQuanFund'];
        this.guquan = response.json()['GuQuan'];
        this.balance = response.json()['Oldmoney'];
        this.gouwu = response.json()['ICE'];
      } )
    } )

  }

  gotoPages(Pages){
    this.app.getRootNav().push(Pages, {
      dongtai: this.dongtai,
      gouwu: this.gouwu,
      balance: this.integralArr['Oldmoney'],
      guquanFund: this.guquanFund,
      guquan: this.guquan
    });
  }

}
