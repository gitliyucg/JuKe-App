import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { FileService } from "../../share/fileService";
import { orderTui} from '../../pages/myorders/ordertui';
import {MyOrders} from "./myorders";
import {orderState} from "./orderstate";
@Component({
    templateUrl: 'orderinfo.html'
})
export class OrderInfoPage {

    ob = this.navParams.get('order');
    order = this.ob.order;
    goods = this.ob.product;
    orderId = this.order.ID;
    orderTime = this.order.Times;
    TotalNum = this.order.TotalNum;
    Total = this.order.Total;
    TotalBonus = this.order.TotalBonus;
    TotalDongTai = this.order.TotalDongTai;
    Marks = this.order.Marks;
    add = this.order.Address.split(',');
    Name = this.add[0];
    Phone = this.add[1];
    Address = this.add[2];

    constructor(
        public http: Http,
        public storage: Storage,
        public navParams: NavParams,
        private file: FileService,
        public alerCtrl: AlertController,
        public nav: NavController,
    ) {
    }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }
  tuikuan(shuju,price) {
    this.nav.push(orderTui, { order: shuju, orderId: this.order.ID,orderTime :this.order.Times,Total:price});

  }
  chakanState(id) {
    this.nav.push(orderState, { OID: id});
  }
  shanchu(event) {   // 删除订单
    let alert = this.alerCtrl.create({
        title: '',
        cssClass: 'alertClass',
        message: '确定删除吗？',
      enableBackdropDismiss:false,
        buttons: [{
          text: '否',
          cssClass: 'canBtn',
          handler: () => { }
        },
          {
            text: '是',
            cssClass: 'sureBtn',
            handler: () => {
              this.http.delete(this.file.localUrl + '/action/Orders/DeleteOrders/' + this.orderId).toPromise().then(response => {
                if (response.json() == true) {
                  this.alerCtrl.create({
                    title: '提示',
                    subTitle: '订单已删除',
                    buttons: [{
                      text: '确定',
                      handler: () => {
                        this.nav.push(MyOrders)
                      }
                    }],
                    cssClass: 'fwh'
                  }).present();
                  return false;
                }
              })
            }
          }
        ]
      }
    )
    alert.present();
  }
  sureQuxiao(event) {
    let alert = this.alerCtrl.create({
      title: '',
      cssClass: 'alertClass',
      message: '确定取消订单吗？',
      enableBackdropDismiss:false,
      buttons: [{
        text: '取消',
        cssClass: 'canBtn',
        handler: () => { }
      },
        {
          text: '确定',
          cssClass: 'sureBtn',
          handler: () => {
            this.ob.order.EndTimes = new Date();
            this.ob.order.State = 1;
            this.http.put(this.file.localUrl + '/action/Orders/Cancel/' + this.orderId,this.ob).toPromise().then(response => {
              this.alerCtrl.create({
                title: '提示',
                subTitle: '订单已取消',
                buttons: [{
                  text: '确定',
                  handler: () => {
                    this.nav.push(MyOrders)
                  }
                }],
                cssClass: 'fwh'
              }).present();
              return false;
            },error => {

              this.alerCtrl.create({
                title: '提示',
                subTitle: error.json().Message,
                buttons: ['确定'],
                cssClass: 'fwh'
              }).present();
              return false;

            })
          }
        }]
    });
    alert.present();

  }
    shouHuo(event) {
         let alert = this.alerCtrl.create({
             title: '',
             cssClass: 'alertClass',
              message: '确定收货吗？',
           enableBackdropDismiss:false,
             buttons: [{
                 text: '否',
               cssClass: 'canBtn',
                 handler: () => { }
             },
             {
                 text: '是',
                cssClass: 'sureBtn',
                 handler: () => {

                     this.ob.order.EndTimes = new Date();
                     this.ob.order.State=4;

                     this.http.put(this.file.localUrl + '/action/Orders/Edit/' + this.orderId, this.ob).toPromise().then(response => {

                       this.alerCtrl.create({
                         title: '提示',
                         subTitle: '订单已完成',
                         buttons: [{
                           text: '确定',
                           handler: () => {
                             this.nav.push(MyOrders)
                           }
                         }],
                         cssClass: 'fwh'
                       }).present();
                       return false;
                     });
                 }
             }]
         });
         alert.present();

    }
}


