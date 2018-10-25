import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ToastController } from "ionic-angular";
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import {FileService} from "../../share/fileService";
import { ListChild } from "../listchild/listchild";

@Component({
  selector: 'yixuan',
  templateUrl: 'yixuan.html',
})
export class YiXuan {
  @Input() shuju;
  @Output() zongjia: EventEmitter<object> = new EventEmitter();

  constructor(
    private toastCtrl: ToastController,
    public navParams: NavParams,
    public nav: NavController,
    public http: Http,
    private file:FileService
  ) { }
  numchange(id, type) {         //数量变动
    for (let i in this.shuju) {
      if (id == this.shuju[i].ID) {
        if (type == 'up') {
          this.shuju[i].Num++;   // 先让数字可以随意增加

          setTimeout(() => {    // 发送验证库存请求并获取结果
            this.http.get(this.file.localUrl +'/action/ShopCars/ValidNum/' + this.shuju[i].ParamID +
              '?num=' + this.shuju[i].Num + "&cid=" + this.shuju[i].ID)
              .toPromise().then(res => {
                if (res.json() === true) {  // 若未超过库存量，直接计算总价
                  this.zongjia.emit();
                } else {     // 若超过库存量，则将库存量设置为返回的库存量数据并计算总价
                  this.shuju[i].Num = res.json()
                  this.shuju[i].tishi2 = true;
                  this.presentToast2()
                  this.zongjia.emit();
                }
              })
          }, 10)
        }
        if (type == 'down') {
          this.shuju[i].tishi2 = false;
          if (this.shuju[i].Num > 1) {
            this.shuju[i].Num--;
          } else if (this.shuju[i].Num == 1) {
            this.presentToast();
          }
          this.zongjia.emit();
        }
      }
    }
  }

  xuanzhong(id) {         //图片前边的圆点,并添加为已选的、决定购买的数据
    let shujulength = this.shuju.length;
    for (let i = 0; i < shujulength; i++) {
      if (id == this.shuju[i].ID) {
        let thisbuy = this.shuju[i].buy;
        if (thisbuy == true) {
          this.shuju[i].buy = false;
        } else {
          this.shuju[i].buy = true;
        }

        this.zongjia.emit();
      }
    }

  }
  presentToast() {    // 当物品数量为1时，提示不能再少了
    let toast = this.toastCtrl.create({
      message: '不能再减啦！',
      duration: 2000,
      position: 'middle',
      cssClass: 'toastClass'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }
  presentToast2() {    // 库存不足提示
    let toast = this.toastCtrl.create({
      message: `您所提交的商品 库存已不足`,
      duration: 2000,
      position: 'middle',
      cssClass: 'toastClass'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }

  xiangqing(item) {   // 点击购物车里的物品，跳到产品详情页
    this.nav.push(ListChild, { item })
  }
}
