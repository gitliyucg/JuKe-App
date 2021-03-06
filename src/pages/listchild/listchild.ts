import { Component } from '@angular/core';
import {PopoverController, NavParams, App} from 'ionic-angular';
import { PopoverPage } from '../intocarts/intocarts';
import { ShoppingCart } from '../shoppingcart/shoppingcart';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import {FileService} from "../../share/fileService";

@Component({
  templateUrl: 'listchild.html',
})
export class ListChild {
  itemIn;  // 用户在首页点击的或购物车里点击的，想详细查看的产品
  uid;   // 此页面开始需要知道是哪个用户再操作软件，所以需要uid
  number;  // 用来显示购物车内物品总数量
  items; // 用户购物车的数据
  productParam;   // 产品规格参数
  noTiao;   // 加入购物车按钮
  tiao;    // 立即兑换按钮
  product = {}; // 产品的详细数据
  PID;  // 产品的PID
  gouwu: string;// 用来控制是分享还是购物
  fenxiang: string;// 用来控制是分享还是购物
  xingShi;//  用来改变底下tab栏的显示和隐藏

  constructor(
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public storage: Storage,
    public http: Http,
    private file:FileService,
    private app:App
  ) {
    this.noTiao = "加入购物车";
    this.tiao = "立即兑换";
    this.items = [];

    this.xingShi = '购物';

    this.gouwu = '购物';
    this.fenxiang = '分享';
  }
  ionViewWillEnter() {
    // 获取用户在首页点击的产品的数据
    this.itemIn = this.navParams.data.item;
    // 获取UID,判断是否已登录
    this.storage.get('userStorage').then(value => {
      if (value) {
        this.uid = parseFloat(value.uid);
      }
      if (this.itemIn.PID) {
        this.PID = this.itemIn.PID   // 从购物车跳过来的Item
      } else {
        this.PID = this.itemIn.ID;  // 从首页跳过来的Item
      }
      // 获取商品的详细数据
      this.http.get(this.file.localUrl + '/action/Products/GetProducts/?ID=' + this.PID).toPromise().then(res => {
        this.product = res.json();
      })
      // 获取商品的规格数据
      this.getParam();
      // 获取用户购物车的数据
      this.addCart();
    })
  }
  Bian() {  // 用来切换分享和选择产品参数页面
    setTimeout(() => {
      this.xingShi = '购物';
    }, 500)
  }
  addCart() {
    if (this.xingShi == '分享') {
      this.xingShi = '购物';
    } else {
      this.http.get(this.file.localUrl + '/action/ShopCars/GetList?uid=' + this.uid).toPromise().then(res => {
        if (this.productParam) { // 如果没有规格参数，就不会弹出选择规格页面
           this.number = res.json().length;
           this.items = res.json();
          // 当产品被加入购物车后，当前规格的产品的数量就会减少
          for (let i = 0; i < this.productParam.length; i++) {
            for (let j = 0; j < this.items.length; j++) {
              if (this.items[j].ParamID == this.productParam[i].ID) {
                if (this.productParam[i].Num >= this.items[j].Num) {
                  this.productParam[i].Num -= this.items[j].Num;
                } else {
                  this.productParam[i].Num = 0;
                }
              }
            }
          }
        } else {
          setTimeout(() => {
            this.getParam();
            this.addCart();
          }, 1000)
        }
      })
    }
  }
  getParam() {
    // 获取规格数据
    this.http.get(this.file.localUrl + '/action/ProductParams/GetParam?PID=' + this.PID).toPromise().then(res => {
      let data = res.json()
      for (let i = 0; i < data.length; i++) {
        if (data[i].Num <= 0) {
          data[i].Num = 0
        }
      }
      this.productParam =data;
    })
  }
  //弹出选择规格的页面
  presentPopover(myEvent, product, uid, ifTiao, xingshi) {
    if (xingshi == '购物') {

      if (this.productParam && this.productParam.length > 0) {
        this.xingShi = '购物';
        let productParam = this.productParam;
        let popover = this.popoverCtrl.create(PopoverPage,
          { product, productParam, uid, ifTiao, xingshi, cb: this.addCart.bind(this), bian: this.Bian.bind(this) },
          { cssClass: 'motai'});
        popover.present({ ev: myEvent });
      }
    }
    if (xingshi == '分享') {

      if (this.productParam && this.productParam.length > 0) {
        this.xingShi = '分享';
        let productParam = this.productParam;
        let popover = this.popoverCtrl.create(PopoverPage,
          { product, productParam, uid, ifTiao, xingshi, cb: this.addCart.bind(this), bian: this.Bian.bind(this) },
          { cssClass: 'motai' });
        popover.present({ ev: myEvent });
      }
    }
  }

  //导向购物车页面
  toCarts(uid, tiao, items) {
    this.xingShi = '购物';
    if (this.number >= 0) {
      this.app.getRootNav().push(ShoppingCart, { uid, tiao, items })
    }
  }
}
