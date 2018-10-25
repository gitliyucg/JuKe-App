import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { FileService } from "../../share/fileService";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MyOrders} from "./myorders";
@Component({
    templateUrl: 'ordertui.html'
})
export class orderTui {

    goodsID = this.navParams.get('order');
  orderId = this.navParams.get('orderId');
  orderTime = this.navParams.get('orderTime');
  Total= this.navParams.get('Total');
    myForm:FormGroup;

    constructor(
        public formBuilder:FormBuilder,
        public http: Http,
        public storage: Storage,
        public navParams: NavParams,
        private file: FileService,
        public alerCtrl: AlertController,
        public nav: NavController,
    ) {
      this.myForm = formBuilder.group({
        TID:['', Validators.required],
        Reason:['', Validators.required],
        Message:['', Validators.required]
      })
    }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }
  tuikuan(event) {


    let alert = this.alerCtrl.create({
      title: '',
      cssClass: 'alertClass',
      message: '确定申请退款吗？',
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
            this.file.showLoading();
            this.file.loading.present().then(() => {
              this.http.post(this.file.localUrl + '/action/OrdersReturns/ShenQingTK/' + this.goodsID, this.myForm.value).toPromise().then(response => {
                this.file.hideLoading();
                this.nav.push(MyOrders)
              });
            })
          }
        }]
    });
    alert.present();

  }

}


