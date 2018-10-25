import {Component} from '@angular/core';

import { ShezhiPage } from '../shezhi/shezhi';
import { CaiwuPage } from '../caiwu/caiwu';
import { FileService } from "../../share/fileService";
import { TuiGuangPage } from "../tuiguang/tuiguang";
import { Storage } from '@ionic/storage';
import { Http } from "@angular/http";
import { BaodanPage } from "../caiwu/baodan";
import { XiaoxiPage } from "../news/xiaoxi";
import { MyOrders } from "../myorders/myorders";
import { ShoppingCart } from "../shoppingcart/shoppingcart";
import { App, Platform, AlertController } from "ionic-angular";
import { MyOrderstui } from "../myorders/myorderstui";
import { AppVersion } from '@ionic-native/app-version';
import { NavController } from 'ionic-angular';
import { RechargesPage } from "../recharges/recharges";
import { DynamicPage } from "../dynamic/dynamic";
import { ConsumptionPage } from "../consumption/consumption";
import { WalletPage } from "../wallet/wallet";
import { NavParams } from "ionic-angular";
import { MystockPage } from "../mystock/mystock";
import { BalancePage } from "../balance/balance";

@Component({
  templateUrl: 'member.html'
})

export class MemberPage {

  isBaodan:number;
  numDfh: number;
  numDsh: number;
  numSh: number;
  numSh1: number;
  numSh2: number;
  numSh3: number;
  userid: string;
  shouyitoday: string;
  dongtaitoday: string;
  shouyizonge: string;
  dongtaizonge: string;
  baodanzonge: string;
  baodanPage: any = BaodanPage;
  caiwuPage: any = CaiwuPage;
  tuiguangPage: any = TuiGuangPage;
  walletPage: any = WalletPage;
  shezhiPage: any = ShezhiPage;
  xiaoxiPage: any = XiaoxiPage;
  ShoppingCart: any = ShoppingCart;
  number: number;// 用来显示购物车物品数量
  xiaoxinum = [];
  // 点击购物车图标跳转到购物车页面需要的数据
  datas;

  //点击跳转到相应页面
  public rechargesPage: any = RechargesPage;//天天奖励
  public dynamicPage: any = DynamicPage;//动态奖励
  public consumptionPage: any = ConsumptionPage;//消费积分
  public mystockPage: any = MystockPage;//我的股权
  public balance: any = BalancePage;//结余积分
  public ICE: number;
  public jieyu: number;

  myOrderInType: string;
  name:string;
  constructor(
    private fileService: FileService,
    private storage: Storage,
    private http: Http,
    private app:App,
    alertCtrl:AlertController,
    private platform: Platform,
    public appVersion:AppVersion,
    public nav: NavController,
    public navParams: NavParams
) {

  }

ionViewDidEnter() {

    this.myOrderInType = "会员中心";
    this.storage.get('userStorage').then(value => {
      if (value!==null&&value!=='undefined'&&value!=='') {
      this.userid = value.userid;
      this.name = value.Name;
      this.isBaodan = value.isBaodan;

      //获取订单数据
      //待发货
      this.http.get(this.fileService.localUrl + '/action/Orders/GetList?uid=' + value.uid + '&state=2&num=1').subscribe(response => {
          this.numDfh = response.json()['total'];
      });
      //待收货
      this.http.get(this.fileService.localUrl + '/action/Orders/GetList?uid=' + value.uid + '&state=3&num=1').subscribe( response => {
          this.numDsh = response.json()['total'];
      } )
      //退款/售后
      // this.http.get(this.fileService.localUrl + '/action/OrdersReturns/GetOrdersReturn?uid=' + value.uid + '&num=1').subscribe( response =>{
      //     this.numSh = response.json()['total'];
      // } )

      this.http.get(this.fileService.localUrl+'/action/users/getuserindex/' + value.uid).subscribe(res => {
        let mydata = res.json();
        this.jieyu = mydata['jieyu'];
        let qianbao = JSON.parse(mydata.qianbao);
        let bonus = JSON.parse(mydata.bonus);
        this.shouyitoday = bonus.Balance;
        this.baodanzonge = qianbao.RegBalance;
        this.dongtaitoday = bonus.DongTaiBonus;
        this.shouyizonge = qianbao.Balance;
        this.dongtaizonge = qianbao.JlBalance;
        this.ICE = qianbao.ICE;
      },error => {
        alert('出现问题了，请检查网络或重新打开APP');
        this.platform.exitApp();
      })
        this.http.get(this.fileService.localUrl + '/action/MessageLists/GetList?un=' + this.userid + '&num=1').subscribe(response => {
          let mydata = response.json();
          this.xiaoxinum = JSON.parse(mydata.data);
        });
      // this.http.get(this.fileService.localUrl+'/action/Orders/GetOrderSize/' + value.uid).subscribe(res => {
      //   let mydata = res.json();
      //   this.numDfh = mydata.fahuo;
      //   this.numDsh = mydata.shouhuo;
      //   this.numSh = mydata.shouhou;
      // })
      // 获取购物车数据
      this.http.get(this.fileService.localUrl+'/action/ShopCars/GetList?uid=' + value.uid).subscribe(res => {
        let productParam = res.json();
        this.datas={};
        if (productParam) {
          // 显示购物车里有多少物品
          // 为防止有负数产品
          let shujuzhengli = res.json();
          let shujuzhengli2 = [];
          for (let i = 0; i < shujuzhengli.length; i++) {
            if (shujuzhengli[i].Num > 0) {
              shujuzhengli2.push(shujuzhengli[i])
            }
          }
          this.number = shujuzhengli2.length;
          this.datas.items = shujuzhengli2;
        }
          this.datas.tiao= "加入购物车";
          this.datas.uid=value.uid;
      })
      }
    })
  }
  // toCaiwuPage(url){
  //   this.nav.push(url);
  // }


  //点击跳转页面
  toRecharge(page){
    this.app.getRootNav().push(page, {
      dongtai: this.dongtaizonge,
      gouwu: this.ICE,
      jieyu: this.jieyu
    })
  }

  toMemberPage(url){
    this.app.getRootNav().push(url);
  }
  toShopCart(){
    this.app.getRootNav().push(ShoppingCart,this.datas);
  }
  toOrder(ob){
    if(ob.state===6){
      this.app.getRootNav().push(MyOrderstui);
    }else{
      this.app.getRootNav().push(MyOrders,ob);
    }


  }

}
