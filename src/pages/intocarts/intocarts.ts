import { Component} from '@angular/core';
import {NavController, ViewController, NavParams, App} from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from "ionic-angular";
import { QueRen } from '../querendingdan/querendingdan';
import {FileService} from "../../share/fileService";

@Component({
  templateUrl: 'intocarts.html'
})
export class PopoverPage {
  UID;     // 获取用户的ID
  product;   //  选择的产品的产品详细数据product
  productParam=[];  // 选择的产品的产品参数数据【id,num,price,sort,state,title】
  num: number;  //选择的单个产品某规格的数量
  maxNum: number; //选择的商品的最多数量
  price: number;  //选择的规格对应的产品价格
  xuan;  //选择的产品的综合数据：规格、数量
  callback;   // 用于更新购物车tab上的数量显示
  callback2;   // 用于更新购物车tab上的数量显示
  tiao;  // 判断是点击加入购物车还是立即兑换
  xingShi;//  用来控制页面的显示形式


  constructor(
    public nav: NavController,
    public view: ViewController,
    public http: Http,
    private toastCtrl: ToastController,
    private params: NavParams,
    private file:FileService,
    private app:App
  ) {
    this.UID = view.data.uid;
    this.product = view.data.product;
    this.callback = this.params.get('cb');
    this.callback2 = this.params.get('bian');
    this.tiao = view.data.ifTiao;

    this.num = 0; // 用户打算购买的数量
    this.maxNum = 0;  // 最大可购买数量

    this.productParam = view.data.productParam;  // 获取上一个页面传来的数据

    this.xingShi = view.data.xingshi

  }
  close() {  //关闭选择规格的模态框
    this.view.dismiss();
  }
  xuanzhong(aa) {
    this.xuan = aa;  //指定被选的规格
    if (aa.Num > 0) {
      this.maxNum = aa.Num;  // 设置最大购买数量
      this.price = (aa.Price).toFixed(2);  // 指定价格
      this.num = 1;
    } else {
      this.maxNum = 0;  // 设置最大购买过数量
      this.price = 0;  // 指定价格
      this.num = 1;
    }
  }
  numup() {  //数量增加
    if (this.num >= this.maxNum) {
      this.presentToast(this.xuan);
      this.num = this.maxNum;
    } else {
      this.num += 1
    }
    return false
  }
  numdown() {  //数量减少
    if (this.num <= 1) {
      this.num = 1;
      return false
    }
    this.num -= 1;
    return false
  }
  xuanze(aa) {  //控制被选的规格的背景色
    if (this.xuan == aa) {
      return true;
    }
    return false;
  }
  // 若用户还未选择规格，是不能提交数据到购物车
  close1(xuan, tiao, uid) {
    if (this.xuan == undefined) {
      this.presentToast(xuan)
    } else {
      let itemsure = {
        UID: uid,
        PID: xuan.PID,
        ParamID: this.xuan.ID,
        Num: Math.ceil(this.num),
        Times: new Date()
      }

      if (itemsure.Num > 0 && itemsure.Num <= this.maxNum) {
        //若为通过点击加入购物车，则关闭模态框，上传客户购买的物品单个数据:itemsure;
        if (this.xuan != undefined && tiao == '加入购物车') {
          this.http.post(this.file.localUrl + '/action/ShopCars/PostShopCar', itemsure).toPromise()
            .then(response => {
              if (response.json() == true) {
                this.view.dismiss();
                this.callback()    // 用来更新购物车数量
                // 弹出加入成功的提示
                this.presentToast2()
              }
            })
        } else
          //若为通过点击立即兑换，则关闭模态框，直接传递数据:itemsure;并跳到订单确认页面，购物车不增加数量
          if (this.xuan != undefined && tiao == '立即兑换') {
            let shuju = {
              xuan: xuan,
              product: this.product,
              itemsure: itemsure
            };
            this.view.dismiss();
            this.gouMakeSure(shuju, tiao, uid);
          }
      } else {

        this.num = this.maxNum;
        this.presentToast(xuan)
      }
    }
  }

  presentToast(xuan) {    // 当物品数量超过库存，提示不能再加了
    let tishiwenzi = '';    // 若用户还未选择规格，进行提示
    if (xuan == undefined) {
      tishiwenzi = '请选择规格！'
    } else {
      tishiwenzi = '已超过库存！'
    }
    let toast = this.toastCtrl.create({
      message: tishiwenzi,
      duration: 2000,
      position: 'middle',
      cssClass: 'toastClass'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
  presentToast2() {    // 成功加入购物车提示
    let toast = this.toastCtrl.create({
      message: '添加成功！',
      duration: 2000,
      position: 'middle',
      cssClass: 'toastClass'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
  gouMakeSure(shuju, tiao, uid) {   // 跳到确认订单页面
    this.app.getRootNav().push(QueRen, { shuju, tiao, uid });
  }
}

