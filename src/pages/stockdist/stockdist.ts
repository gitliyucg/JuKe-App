import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Http } from "@angular/http";
import { FileService } from "../../share/fileService";
import { Md5 } from "ts-md5/dist/md5";
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AlertController } from "ionic-angular";
import { StockdistlistPage } from "../stockdistlist/stockdistlist";
import 'rxjs/add/operator/debounceTime';

/**
 * Generated class for the StockdistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-stockdist',
  templateUrl: 'stockdist.html',
})
export class StockdistPage {

  public ID;
  public Md5;
  public stock: number;
  public stockForm: FormGroup;
  public name;//用户姓名
  public UserID;
  public show: boolean;
  public stockdistlistPage: any = StockdistlistPage;//记录

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http: Http,
    public fileScrvice: FileService,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController
  ) {
    this.stockForm = formBuilder.group({
      grantNun: ['', Validators.required],
      userID: ['', Validators.required]
    })

  }

  ionViewDidLoad() {
    this.storage.get('userStorage').then( value => {
      this.ID = value['uid'];
      this.UserID = value['userid'];
      this.Md5 = Md5.hashStr(this.ID + 'mEnglong0526');
      let userMd5 = Md5.hashStr(this.UserID + 'mEnglong0526');
      this.http.get(this.fileScrvice.localUrl + '/action/GuQuan/GetGuQuan/' + this.UserID + '?md5=' + userMd5).subscribe( response => {
        this.stock = response.json();
      } ,error => {
        this.alertCtrl.create({
          title: '提示',
          subTitle: error.json()['Message'],
          buttons: [{
            text: '确定',
            cssClass: 'fwh',
            handler: () => {
              this.navCtrl.pop();
            }
          }]
        }).present();
      })
    } )

    //自动获取用户名
    this.stockForm.get('userID').valueChanges.debounceTime(1000).subscribe( value =>{
      this.http.get(this.fileScrvice.localUrl + '/action/Users/GetName?un=' + value).subscribe( response => {
        this.name = response.json();
      } ,error => {
        this.alertCtrl.create({
          title: '提示',
          subTitle: error.json()['Message'],
          buttons: [{
            text: '确定',
            cssClass: 'fwh'
          }],
          enableBackdropDismiss:false
        }).present();
      })
    } )
  }

  toListPage(page){
    this.navCtrl.push(page)
  }

  toGrant(){
    this.show = true;
    let params = {
      UID: this.ID,
      UserID: this.UserID,
      AcceptUserID: this.stockForm.get('userID').value,
      AcceptUserName: this.name,
      MoneySum: this.stockForm.get('grantNun').value
    }
    this.http.post(this.fileScrvice.localUrl + '/action/GuQuan/PostFenpei', params).subscribe( response =>{
      if(response.json()){
        this.alertCtrl.create({
          title: '提示',
          subTitle: '分配成功',
          buttons: [{
            text: '确定',
            cssClass: 'fwh',
            handler: () => {
              this.navCtrl.pop();
            }
          }],
          enableBackdropDismiss:false
        }).present()
      }
    } ,error => {
      this.show = false;
      this.alertCtrl.create({
        title: '提示',
        subTitle: error.json()['Message'],
        buttons: [{
          text: '确定',
          cssClass: 'fwh',
          handler: () => {
            this.navCtrl.pop();
          }
        }],
        enableBackdropDismiss:false
      }).present()
    })
  }

}
