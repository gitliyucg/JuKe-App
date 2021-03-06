import { Component,ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import {NavParams, NavController, AlertController} from 'ionic-angular';
import { FileService } from "../../share/fileService";
import { OrderInfoPage } from "./orderinfo";
import {Content } from 'ionic-angular';
import { MemberPage } from "../member/member"
@Component({
  templateUrl: 'myorders.html'
})
export class MyOrders {
  @ViewChild(Content) content:Content;
  getState=['卖家审核中','审核未通过','填写快递单','等待卖家签收','已完成']
  uid;
  num; // 订单列表分页号
  key:boolean = true; //条件查询下啦刷新开关
  daifahuo:Array<any>=[]; // 待发货2
  yifahuo:Array<any>=[]; // 已经发货3
  yiwancheng:Array<any>=[]; // 已完成4
  OrdersArry:Array<any>=[]; // 用来存放整理后的所有订单数据
  myOrderInType; // 用来控制左上角的返回箭头
  qiehuan;  // 用来控制上方的四个按钮切换
  state;
  show: boolean;


  constructor(
    public http: Http,
    public storage: Storage,
    public navParams: NavParams,
    public fileService: FileService,
    public nav: NavController,
    public alerCtrl: AlertController
  ) {

    this.num = 1;

    this.myOrderInType = this.navParams.data.myOrderInType;
    this.state = this.navParams.data.state;
    if (this.state == ''||!this.state) {
      this.qiehuan = "all";
    } else if (this.state == 2) {
      this.qiehuan = "daifahuo";
    } else if (this.state == 3) {
      this.qiehuan = "yifahuo";
    }else if (this.state == 4) {
      this.qiehuan = "yiwancheng";
    }
    // 以订单为单位，将订单和订单对应的产品分在一起,形成一个二维数组

  }

  backShouYe(){
    this.nav.push(MemberPage)
  }

  ionViewDidEnter() {
    this.getData('');
    this.getData(2);
    this.getData(3);
    this.getData(4);
  }
  gengDuo(value) {  // 点击上边进行切换
    this.state = value;
    this.num = 1;
    this.key=true;
    this.content.scrollToTop();
  }


  getData(state) {  // 获取订单数据
    this.storage.get('userStorage').then(value => {
      this.uid = value.uid;
      let url = '';
      if (state == '') {
          this.fileService.showLoading();
          url = this.fileService.localUrl + '/action/Orders/GetList?uid='+this.uid;
      } else{
          url = this.fileService.localUrl + '/action/Orders/GetList?uid='+this.uid+'&state='+state+'&num='+this.num;
      };


        this.http.get(url).toPromise().then(res => {

          let product = JSON.parse(res.json().product);  // 获取的产品数据
          let data = JSON.parse(res.json().data);  // 获取的订单数据
          let arr = [];

          if (res.json().total > 0) {  // 如果订单量为零，直接显示无订单页面
            for (let i = 0; i < data.length; i++) {
              let obj = {
                order: data[i],
                product: [],
                totalNum: 0,  // 单个订单的总产品量
                totalJifen: 0,// 单个订单的总积分
              };

              for (let j = 0; j < product.length; j++) {
                if (product[j].OID == data[i].ID) {
                  obj.product.push(product[j]);
                  obj.totalNum += product[j].Num
                  obj.totalJifen += product[j].Price
                }
              }
              arr.push(obj)
            }
            if (state == '') {
              this.fileService.loading.present().then(() => {
                this.fileService.hideLoading();
              })
              this.OrdersArry = arr;
            } else if (state == 2) {
              this.daifahuo = arr
            } else if (state == 3) {
              this.yifahuo = arr
            }else if (state == 4) {
              this.yiwancheng = arr
            }
          }else{
            if (state == '') {
              this.fileService.loading.present().then(() => {
                this.fileService.hideLoading();
              })
            }
          }
        })
    })

  }
  chaKan(bb) {  // 查看订单详情
    this.num = 1;
    this.nav.push(OrderInfoPage, { order: bb });
  }
  shanchu(event, bb) {   // 删除订单
    this.show = true;
    event.preventDefault();
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
              this.http.delete(this.fileService.localUrl + '/action/Orders/DeleteOrders/' + bb.order.ID).toPromise().then(response => {
                if (response.json() == true) {
                  this.getData('');
                  this.gengDuo('');
                  this.nav.pop();
                }
              })
            }
          }
        ]
      }
    )
    alert.present();
  }
  // 确认收货
  sureShouHuo(event, shuju) {
    this.show = true;
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
            // let order = shuju.order;
            // order.EndTimes = new Date();
            // order.State = 4;
            this.http.put(this.fileService.localUrl + '/action/Orders/PutShouHuo/' + shuju.order.ID, {}).toPromise().then(response => {
              if (response.json() == true) {
                this.getData('');
                this.gengDuo('');
                this.nav.pop();
              }
            });
          }
        }]
    });
    alert.present();

  }
  sureQuxiao(event, shuju) {
    this.show = true;
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
            let order = shuju.order;
            order.EndTimes = new Date();
            order.State = 1;
            this.http.put(this.fileService.localUrl + '/action/Orders/Cancel/' + order.ID,order).toPromise().then(response => {
              if (response['ok']){
                this.alerCtrl.create({
                  title: '提示',
                  subTitle: '订单已取消',
                  buttons: [{
                    text: '确定',
                    handler: () => {
                      this.getData('');
                      this.gengDuo('');
                      this.nav.pop();
                    }
                  }]
                }).present()
              }
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
  doInfinite(infiniteScroll) {  // 上拉执行，获取数据
    if (this.key) {
      setTimeout(() => {
        this.num ++;
        let url = this.fileService.localUrl + `/action/Orders/GetList?uid=${this.uid}&state=${this.state}&num=${this.num}`
          this.http.get(url).toPromise().then(res => {
            let product = JSON.parse(res.json().product);  // 获取的产品数据
            let data = JSON.parse(res.json().data);  // 获取的订单
            if (data.length == 0) {
              this.key = false;  //阻止上拉刷新多次无用刷新
            }else {
              for (let i = 0; i < data.length; i++) {
                let obj = {
                  order: data[i],
                  product: [],
                  totalNum: 0,  // 单个订单的总产品量
                  totalJifen: 0,// 单个订单的总积分
                };
                for (let j = 0; j < product.length; j++) {
                  if (product[j].OID == data[i].ID) {
                    obj.product.push(product[j]);
                    obj.totalNum += product[j].Num
                    obj.totalJifen += product[j].Price
                  }
                }
                if (this.state == '') {
                  this.OrdersArry.push(obj)
                } else if (this.state == 2) {
                  this.daifahuo.push(obj)
                } else if (this.state == 3) {
                  this.yifahuo.push(obj)
                }else if (this.state == 4) {
                  this.yiwancheng.push(obj)
                }
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
