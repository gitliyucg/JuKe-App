import { Component } from '@angular/core';
import {PopoverController, NavParams, NavController, AlertController} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { addShouHuo } from '../addShouHuo/addShouHuo';
import { DiZhiGuanLi } from '../dizhiguanli/dizhiguanli';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { PopovercodePage } from '../../share/pagination/popovercode';
import { FileService } from "../../share/fileService";
import { SubSuccessOrder } from "../../pages/succ/successOrder";
import { MyOrders } from '../myorders/myorders';
import {ShareModule} from "../../share/share.module";

@Component({
  templateUrl: 'querendingdan.html',
})
export class QueRen {
  item;  // 已经提交订单的商品购买数据数组,从上个页面传来
  totalPrice: number =0;
  ifDizhi: string;  // 判断是否有收货地址
  tiao;   // 判断是通过点击加入购物还是立即兑换，跳过来的
  finally;  // 用户最终支付后的订单数据

  name: string;
  phone: number;
  moren: string;
  dizhi: string;
  uid: number;
  userID;
  checked1;   // 天天收益滑块状态设定
  checked2;  // 动态奖励滑块状态设定
  jifentishi1: string;  // 积分是否充足的提示
  jifentishi2: string;
  buttonKey=false;
  dongtaiyue: number =0; //动态余额
  shouyiyue: number = 0;   //天天收益
  constructor(
    public navParams: NavParams,
    public nav: NavController,
    private storage: Storage,
    public http: Http,
    private pop: PopoverController,
    private alertCtrl: AlertController,
    private fileService: FileService,
    private toastCtrl: ToastController,
    private share:ShareModule
  ) {
    this.checked1 = false; // 天天收益滑块状态设定
    this.checked2 = true;// 动态奖励滑块状态设定
    this.jifentishi1 = "可用来购买商品";
    this.jifentishi2 = "可用来购买商品";
    this.finally = {
      Codes: 0,
      UID: 0,
      TotalMoney: 0,
      TotalBonus: 0,  // 天天收益
      TotalDongTai: 0,  // 动态奖励
      Total: 0,
      TotalNum: 0,
      Address: '',
      Marks: '',
      CarIDS: [],
    }
    this.finally.Total = 0
    this.tiao = navParams.data.tiao;
    this.item = []
    //根据跳转到此页面的点击事件,获取确定购买的产品的数据
    if (this.tiao == "立即兑换") {
      // html里是ngFor，所以this.item必须是数组，通过立即兑换，传过来的是一个对象
      let linshishuju = {   // 通过上个页面传来的数据进行拼接
        Images: navParams.data.shuju.product.Images,
        Num: navParams.data.shuju.itemsure.Num,
        PID: navParams.data.shuju.itemsure.PID,
        ParamID: navParams.data.shuju.itemsure.ParamID,
        ParamName: navParams.data.shuju.xuan.Title,
        Price: navParams.data.shuju.xuan.Price,
        Title: navParams.data.shuju.product.Title,
        UID: navParams.data.uid
      }
      this.item.push(linshishuju);
      this.uid = navParams.data.uid;
      this.huoqudizhi();
      this.huoqujifen();
      this.zongfukuan();
    } else {   // 从购物车跳过来的页面
      this.item = navParams.data.shuju2;
      this.uid = this.item[0].UID;
      this.huoqudizhi();
      this.huoqujifen();
      this.zongfukuan()
    }
  }
  ionViewWillEnter() {   // 获取地址数据，实现页面载入及获取地址
    this.huoqudizhi();
  }
  //判断积分是否可以兑换

  // 计算总付款额
  zongfukuan() {
    this.totalPrice = 0
    let k = 0;
    for (let i in this.item) {
      k += parseFloat(this.item[i].Num) * parseFloat(this.item[i].Price)
    }
    this.totalPrice = k
  }
  // 获取用户的积分数据
  huoqujifen() {
    this.storage.get('userStorage').then(value => {
      this.userID = value.userid;
      this.uid = value.uid;
      this.http.get(this.fileService.localUrl + '/action/Users/GetYue?uid=' + this.userID).subscribe(res => {
        let mydata = res.json();
        this.dongtaiyue =mydata.dongtai||0;
        this.shouyiyue = mydata.tiantian||0;
        this.checkedmeney(this.dongtaiyue);
      })
    })
  }
  //  获取用户的地址信息,获取地址数据,判断是否已设置收货地址
  huoqudizhi() {
    this.http.get(this.fileService.localUrl + '/action/Addresses/GetDefault?uid=' + this.uid).subscribe(res => {
      let address = res.json();


            this.ifDizhi = '有地址';
            this.name = address.Name;
            this.phone = address.Phone;
            this.moren = '默认';
            this.dizhi = `${address.Province}${address.City}${address.Areas}${address.Address1}`
            this.finally.Address = `${address.Name},${address.Phone},${address.Province}${address.City}${address.Areas}${address.Address1}`;    //  finally.Address

    },error => {
      this.ifDizhi = '没地址';
    })
  }
  checkedmeney(t){
    if((this.checked2&&!this.checked1)||(!this.checked2&&this.checked1)) {
      if(t>=this.totalPrice) {
        this.buttonKey = true;
        if (this.checked1 === true && this.checked2 !== true) {
          this.finally.TotalBonus = this.totalPrice;
          this.finally.TotalDongTai = 0;
        } else if (this.checked2 === true && this.checked1 !== true) {
          this.finally.TotalDongTai = this.totalPrice;
          this.finally.TotalBonus = 0;
        }

      }
    }else if(this.checked2&&this.checked1){
      let z = this.share.accAdd(this.shouyiyue, this.dongtaiyue);
      if (z < this.totalPrice) {
        this.buttonKey = false;
      } else {
        this.buttonKey = true;
        if(this.dongtaiyue>=this.totalPrice){
          this.finally.TotalDongTai = this.totalPrice;
          this.finally.TotalBonus = 0;
        }else{
          this.finally.TotalDongTai = this.dongtaiyue;
          this.finally.TotalBonus = this.share.Subtr(this.totalPrice,this.finally.TotalDongTai);
        }

      }
    }else{
      this.buttonKey = false;
    }

  }
  addshouhuo() {  //添加收货地址
    this.nav.push(addShouHuo, { type: "添加收货地址" });
  }
  dizhiguanli() {
    this.nav.push(DiZhiGuanLi);
  }
  // 获取textarea的内容
  onInput(ev) {
    this.finally.Marks = ev.target.value;   //  this.finally.Marks
  }
  showConfirm(password) {  // 显示输入密码页面

    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertClass',
      message: '您确定支付吗？',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: '取消',
          cssClass: 'canBtn',
          handler: () => { }
        },
        {
          text: '确定',
          cssClass: 'sureBtn',
          handler: () => {
            this.fileService.showLoading();
            this.http.get(this.fileService.localUrl + '/action/Users/VerifyPass?un=' + this.userID + '&pass=' + password).subscribe(response => {

              if (response.json()) {

                // 上传支付数据
                this.finally.CarIDS=[];
                for (let i in this.item) {
                  let obj = {
                    CarID:this.item[i].ID||0,
                    PID: this.item[i].PID,
                    Title: this.item[i].Title,
                    Images: this.item[i].Images,
                    ParamID: this.item[i].ParamID,
                    Params: this.item[i].ParamName,
                    Price: this.item[i].Price,
                    Num: this.item[i].Num
                  }
                  if (this.finally.CarIDS.length == 0) {
                    this.finally.CarIDS.push(obj)
                  } else {
                    for (let j = 0; j < this.finally.CarIDS.length; j++) {
                      if (this.finally.CarIDS[j].ParamID != obj.ParamID) {
                        this.finally.CarIDS.push(obj)   //  finally.CarIDS
                      }
                    }
                  }
                  this.finally.TotalNum += this.item[i].Num  //  finally.TotalNum
                }
                this.finally.UID = this.uid;     //  finally.UID

                this.finally.Total = this.totalPrice;   //  finally.Total

                // 当用积分进行付款时的提示


                this.http.post(this.fileService.localUrl + '/action/Orders/Create', this.finally).toPromise().then(response => {

                  let successObj: Object;
                  this.fileService.hideLoading();
                  if (response.json() == true) {
                    successObj = {
                      successImg: 'assets/img/succ.png',
                      successTitle: '支付成功',
                      successBtn1: '我的订单',
                      successBtn2: '继续购物',
                      successUrl1: MyOrders,   // 订单详情页
                      successUrl2:''
                    }
                  } else {
                    successObj = {
                      successImg: 'assets/img/fail.png',
                      successTitle: '支付失败',
                      successBtn1: '重新支付',
                      successUrl1: QueRen,
                    }
                  }

                  this.nav.push(SubSuccessOrder, { successObj: successObj});
                });
              } else {
                this.fileService.hideLoading();
                this.alertCtrl.create({
                  title: '密码错误',
                  subTitle: '请确认是否输入正确的二级密码',
                  buttons: ['确定'],
                  cssClass: 'fwh'
                }).present();
              }

            });
          }
        }
      ]
    });
    confirm.present();
  }
  presentToast3() {    // 添加地址提示
    let toast = this.toastCtrl.create({
      message: '请先添加收货地址！',
      duration: 2000,
      position: 'middle',
      cssClass: 'toastClass'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }


  fanhui() {
    this.nav.pop()
  }
  // 支付
  zhifu(myEvent) {
    if (this.ifDizhi == '没地址') {    // 当没有收货地址时，弹出提示
      this.presentToast3()
    } else {
          //弹出二级密码输入框
          let popover = this.pop.create(PopovercodePage, {
            cb: this.showConfirm.bind(this)
          }, { cssClass: 'codeClass' });
          popover.present({
            ev: myEvent
          });
    }
  }
}
