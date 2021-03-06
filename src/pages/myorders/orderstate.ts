import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, NavController, AlertController } from 'ionic-angular';
import { FileService } from "../../share/fileService";
import {orderWuliu} from "./wuliu";
import {MemberPage} from "../member/member";
@Component({
    templateUrl: 'orderstate.html'
})
export class orderState {
    public id = this.navParams.get('OID');
    orid:number;
    getState=['卖家审核中','审核未通过','填写快递单','等待卖家签收','已完成']
    public Reason:string;
    public Message:string;
    public State:number;
    public ReturnTimes:string;
    public ReturnMess:string;
    public Price:number;
    public ReturnAddress: string;
    constructor(
        public http: Http,
        public navParams: NavParams,
        private file: FileService,
        public alerCtrl: AlertController,
        public nav: NavController,
    ) {

    }
  ionViewDidEnter() {
    this.http.get(this.file.localUrl+'/action/OrdersReturns/GetView?odid=' + this.id).subscribe(res => {
      let mydata = res.json();
      this.Reason = mydata.Reason;
      this.Message = mydata.Message;
      this.State = mydata.State;
      this.ReturnTimes = this.getTime(mydata.ReturnTimes);
      this.ReturnMess = mydata.ReturnMess;
      this.orid = mydata.ID;
      this.Price = mydata.Price;
      this.ReturnAddress = mydata.Address;
    })
  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }
  wuliu(){
    this.nav.push(orderWuliu,{id:this.orid})
  }
  quxiao(event) {


    let alert = this.alerCtrl.create({
      title: '',
      cssClass: 'alertClass',
      message: '确定取消申请退款吗？',
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
            this.http.get(this.file.localUrl + '/action/OrdersReturns/Cancel/' + this.orid).subscribe(response => {
              if (response.json() == true) {
                this.alerCtrl.create({
                  title: '提示',
                  subTitle: '申请已取消',
                  buttons: [{
                    text: '确定',
                    handler: () => {
                      this.nav.push(MemberPage)
                    }
                  }],
                  cssClass: 'fwh'
                }).present();
                return false;
              }
            })

          }
        }]
    });
    alert.present();

  }

}


