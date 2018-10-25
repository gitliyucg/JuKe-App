import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import {NavParams, NavController} from 'ionic-angular';
import { FileService } from "../../share/fileService";
import {orderState} from "./orderstate";
@Component({
  templateUrl: 'myorderstui.html'
})
export class MyOrderstui {

  getState=['卖家审核中','审核未通过','填写快递单','等待卖家签收','已完成']
  uid;
  num; // 订单列表分页号
  key:boolean = true; //条件查询下啦刷新开关
  tuihuo:Array<any>=[]; // 退货 6


  constructor(
    public http: Http,
    public storage: Storage,
    public navParams: NavParams,
    public fileService: FileService,
    public nav: NavController,
  ) {
    this.num = 1;
  }
  ionViewDidEnter() {
    this.storage.get('userStorage').then(value => {
      this.uid = value.uid;
      this.http.get(this.fileService.localUrl + '/action/OrdersReturns/GetOrdersReturn?uid=' + this.uid + '&num=' + this.num).toPromise().then(res => {
        this.tuihuo = JSON.parse(res.json().data);
      })
    })
  }
  chakanState(id) {
    this.num = 1;
    this.nav.push(orderState, { OID: id});
  }

  doInfinite(infiniteScroll) {  // 上拉执行，获取数据
    if (this.key) {
      setTimeout(() => {
        this.num ++;
          this.http.get(this.fileService.localUrl + '/action/OrdersReturns/GetOrdersReturn?uid=' + this.uid + '&num=' + this.num).toPromise().then(res => {
            let mydata = JSON.parse(res.json().data);  // 获取的订单
            if (mydata.length == 0) {
              this.key = false;
            }else{
              for (let data of mydata) {
                this.tuihuo.push(data);
              }
            }
            infiniteScroll.complete();
          })
      }, 500);
    } else {
      infiniteScroll.complete();
    }
  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
  }
}
