import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Http } from "@angular/http";
import { FileService } from "../../share/fileService";
import { MemberPage } from "../member/member";
import { Md5 } from "ts-md5/dist/md5";
import { AlertController } from "ionic-angular";

/**
 * Generated class for the BalancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html',
})
export class BalancePage {

  //结余积分
  public Oldmoney: number;

  public ID: string;
  public Times: string;
  public disable: boolean;
  public year;
  public month;
  public day;
  public time;
  public branch;
  public second;
  public tiantianMd5;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http: Http,
    public fileService: FileService,
    public alertCtrl: AlertController
  ) {

  }

  ionViewDidLoad() {

    //获取传过来的结余积分
    if (this.navParams.get('balance') == undefined){
      this.Oldmoney = this.navParams.get('jieyu');
    }else {
      this.Oldmoney = this.navParams.get('balance');
    }

    this.storage.get('userStorage').then( value =>{
      this.ID = value['uid'];
      //Md5
      this.tiantianMd5 = Md5.hashStr(this.ID + 'mEnglong0526');
      //获取用户可转换的时间
      this.http.get(this.fileService.localUrl + '/action/JieYu/GetTimeDown/' + this.ID + '?md5=' +this.tiantianMd5).subscribe( response => {
        if (response.json()['error']){
          this.alertCtrl.create({
            title: '提示',
            subTitle: response.json()['error'],
            buttons: [{
              text: '确定',
              handler: () => {
                this.navCtrl.pop();
              }
            }],
            cssClass: 'fwh'
          }).present(
          );
        }else {
          this.disable = response.json()['result']
          this.Times = response.json()['time'].split(' ');
          this.year = this.Times[0].split('/')[0];
          this.month = this.Times[0].split('/')[1];
          this.day = this.Times[0].split('/')[2];
          this.time = this.Times[1].split(':')[0];
          this.branch = this.Times[1].split(':')[1];
          this.second = this.Times[1].split(':')[2];
        }
      }, error => {
      })
    })

  }

  toBaodan(UID){
    this.http.post(this.fileService.localUrl + '/action/JieYu/Postregb/' + this.ID + '?md5=' + this.tiantianMd5,{}).subscribe( response => {
      if (response.json()){
        this.alertCtrl.create({
          title: '提示',
          subTitle: '转换成功',
          buttons: [{
            text: '确定',
            cssClass: 'fwh',
            handler: () => {
              this.navCtrl.push(MemberPage)
            }
          }]
        })
      }
    } )
  }

  toTiantian(UID){
    this.http.get(this.fileService.localUrl + '/action/JieYu/PostDays/' + this.ID + '?md5=' + this.tiantianMd5).subscribe( response => {
      if (response.json()){
        this.alertCtrl.create({
          title: '提示',
          subTitle: '转换成功',
          buttons: [{
            text: '确定',
            cssClass: 'fwh',
            handler: () => {
              this.navCtrl.push(MemberPage)
            }
          }]
        })
      }
    } )
  }

}
