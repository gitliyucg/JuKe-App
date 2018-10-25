import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { Http } from "@angular/http";
import { FileService } from "../../share/fileService";
import { AlertController } from "ionic-angular";
import { StockchangelistPage } from "../stockchangelist/stockchangelist";
import { MemberPage } from "../member/member";

/**
 * Generated class for the StockchangePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-stockchange',
  templateUrl: 'stockchange.html',
})
export class StockchangePage {

  public stockForm: FormGroup;
  public UID;
  public yue;
  public yueObj;
  public stock: number;
  public maxNum: boolean;
  public stockchangelistPage: any = StockchangelistPage
  public show: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public storage: Storage,
    public http: Http,
    public fileService: FileService,
    public alertCtrl: AlertController
    ) {

    this.stockForm = formBuilder.group({
      stockType: ['股权收益'],
      stockNum: ['', [Validators.required, Validators.pattern('^\\+?[1-9][0-9]*$')]]
    })

  }

  ionViewDidLoad() {

    this.storage.get('userStorage').then( value => {
      this.UID = value['userid'];
      //获取余额
      this.http.get(this.fileService.localUrl + '/action/users/getyue?uid=' + this.UID).subscribe( response => {
        this.yueObj = response.json();
        this.yue = this.yueObj['GuQuan'];
        this.stock = this.yueObj['GuQuanFund'];
      } )
    } )

  }

  toList(Page){
    this.navCtrl.push(Page)
  }

  stockType(event){
    if (event == '股权收益'){
      this.yue = this.yueObj['GuQuan'];
    }else if(event == '报单金额'){
      this.yue = this.yueObj['RegBalance'];
    }else if(event == '动态奖励'){
      this.yue = this.yueObj['dongtai'];
    }else if(event == '天天奖励'){
      this.yue = this.yueObj['tiantian'];
    }
  }

  //余额最大值验证
  validMax(event){
    if(event.target.value > this.yue){
      this.maxNum = true;
    }else {
      this.maxNum = false;
    }
  }

  exchange(UID){
    this.show = true;
    let params = {
      UserID: UID,
      Type: this.stockForm.get('stockType').value,
      MoneySum: this.stockForm.get('stockNum').value,
    }
    this.http.post(this.fileService.localUrl + '/action/GuQuan/PostDuiHuan/' + UID, params).subscribe( response => {
      if(response.json()){
        this.alertCtrl.create({
          title: '提示',
          subTitle: '兑换成功',
          buttons: [{
            text: '确定',
            handler: () => {
              this.navCtrl.push(MemberPage)
            },
            cssClass: 'fwh'
          }],
          enableBackdropDismiss:false
        }).present();
      }
    }, error => {
      this.show = false;
      this.alertCtrl.create({
        title: '提示',
        subTitle: error.json()['Message'],
        buttons: [{
          text: '确定',
          handler: () => {
            this.navCtrl.pop()
          },
          cssClass: 'fwh'
        }],
        enableBackdropDismiss:false
      }).present()
    })
  }

}
