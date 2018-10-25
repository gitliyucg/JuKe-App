import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { Http } from "@angular/http";
import { FileService } from "../../share/fileService";
import { Md5 } from "ts-md5/dist/md5";
import { AlertController } from "ionic-angular";
import { StockclistPage } from "../stockclist/stockclist";

/**
 * Generated class for the StockPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {

  public stockForm: FormGroup;
  public UID;
  public Md5;
  public stock;
  public agent;//转向代理
  public MaxNum: boolean;
  public stockclistPage: any = StockclistPage;
  public show: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public formBuilder: FormBuilder,
    public storage: Storage,
    public fileService: FileService,
    public alertCtrl: AlertController
  ) {
    this.stockForm = formBuilder.group({
      MoneySum:['', [Validators.required, Validators.pattern('^\\+?[1-9][0-9]*$')]]
    })
  }

  ionViewDidLoad() {

    this.storage.get('userStorage').then( value => {
      this.UID = value['userid'];
      if(value['isBaodan'] == 1 || value['BCenter'] == '0000'){
        this.agent = 3333
      }else{
        this.agent = value['BCenter']
      }
      this.Md5 = Md5.hashStr(this.UID + 'mEnglong0526');
      this.http.get(this.fileService.localUrl + '/action/GuQuan/GetGQjifen/' + this.UID + '?md5=' + this.Md5).subscribe( response => {
        this.stock = response.json();
      } )
    } )

  }

  maxNum(event){
    if(event.target.value > this.stock){
      this.MaxNum = true;
    }else {
      this.MaxNum = false;
    };
  }

  toList(Page){
    this.navCtrl.push(Page);
  }

  toGrant(UID){
    this.show = true;
    let params = {
      UserID: UID,
      AcceptID: this.agent,
      MoneySum: this.stockForm.get('MoneySum').value
    }
    this.http.post(this.fileService.localUrl + '/action/GuQuan/PostBuy', params).subscribe( response => {
      if(response.json()){
        this.alertCtrl.create({
          title: '提示',
          subTitle: '购买成功',
          buttons: [{
            text: '确定',
            cssClass: 'fwh',
            handler: () =>{
              this.navCtrl.pop()
            }
          }],
          enableBackdropDismiss:false
        }).present()
      };
    }, error => {
      this.show = false;
      this.alertCtrl.create({
        title: '提示',
        subTitle: error.json()['Message'],
        buttons: [{
          text: '确定',
          cssClass: 'fwh',
          handler: () =>{
            this.navCtrl.pop()
          }
        }],
        enableBackdropDismiss:false
      }).present()
    })
  }

}
