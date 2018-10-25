import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Http } from "@angular/http";
import { FileService } from "../../share/fileService";
import { Md5 } from "ts-md5/dist/md5";
import { AlertController } from "ionic-angular";
import { MemberPage } from "../member/member";

/**
 * Generated class for the GuquanPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-guquan',
  templateUrl: 'guquan.html',
})
export class GuquanPage {

  public UID;
  public Md5;
  public guQuan: number;
  public show: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public http:Http,
    public fileService: FileService,
    public alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {

    //获取传过来的值
    this.guQuan = this.navParams.get('guquan')

    this.storage.get('userStorage').then( value => {
      this.UID = value['userid'];
      let UID = value['userid']
      if (this.guQuan == undefined){
        this.http.get(this.fileService.localUrl + '/action/Users/GetYue?uid=' + UID).subscribe( response =>{
          this.guQuan = response.json()['GuQuan'];
        } )
      }
      //Md5值
      this.Md5 = Md5.hashStr(this.UID + 'mEnglong0526')
    } )
  }

  //股权收益转换到天天奖励
  toGuquan(UID){
    this.show = true;
    if (this.guQuan == 0){
      this.alertCtrl.create({
        title: '提示',
        subTitle: '余额不足',
        buttons: [{
          text: '确定',
          handler: () => {
            this.navCtrl.pop();
          }
        }],
        cssClass: 'fwh',
        enableBackdropDismiss:false
      }).present()
    }else {
      this.http.post(this.fileService.localUrl + '/action/GuQuan/PostTransfDay/' + UID + '?md5=' + this.Md5, {}).subscribe( response =>{
        if (response.json()){
          this.alertCtrl.create({
            title: '提示',
            subTitle: '转换成功',
            buttons: [{
              text: '确定',
              handler: () => {
                this.navCtrl.push(MemberPage);
              }
            }],
            cssClass: 'fwh',
            enableBackdropDismiss:false
          }).present();
        }
      } ,error => {
        this.show = false;
        this.alertCtrl.create({
          title: '提示',
          subTitle: error.json()['Message'],
          buttons: [{
            text: '确定',
            handler: () => {
              this.navCtrl.pop();
            }
          }],
          cssClass: 'fwh',
          enableBackdropDismiss:false
        }).present()
      })
    }
  }

  //股权收益转换到报单金额
  toBaodan(UID){
    this.show = true;
    if(this.guQuan == 0){
      this.alertCtrl.create({
        title: '提示',
        subTitle: '余额不足',
        buttons: [{
          text: '确定',
          handler: () => {
            this.navCtrl.pop();
          }
        }],
        cssClass: 'fwh',
        enableBackdropDismiss:false
      }).present()
    }else {
      this.http.post(this.fileService.localUrl + '/action/GuQuan/TransfReg/' + UID + '?md5=' + this.Md5, {}).subscribe( response => {
        if (response.json()){
          this.alertCtrl.create({
            title: '提示',
            subTitle: '转换成功',
            buttons: [{
              text: '确定',
              handler: () => {
                this.navCtrl.push(MemberPage);
              }
            }],
            cssClass: 'fwh',
            enableBackdropDismiss:false
          }).present();
        }
      } ,error => {
        this.show = false;
        this.alertCtrl.create({
          title: '提示',
          subTitle: error.json()['Message'],
          buttons: [{
            text: '确定',
            handler: () => {
              this.navCtrl.pop();
            }
          }],
          cssClass: 'fwh',
          enableBackdropDismiss:false
        }).present()
      })
    }
  }

  //股权收益转换到动态奖励
  toGuquanifen(UID){
    this.show = true;
    if (this.guQuan == 0){
      this.alertCtrl.create({
        title: '提示',
        subTitle: '余额不足',
        buttons: [{
          text: '确定',
          handler: () => {
            this.navCtrl.pop();
          }
        }],
        cssClass: 'fwh',
        enableBackdropDismiss:false
      }).present()
    }else {
      this.http.post(this.fileService.localUrl + '/action/GuQuan/TransfJifen/' + UID + '?md5=' + this.Md5, {}).subscribe( response => {
        if (response.json()){
          this.alertCtrl.create({
            title: '提示',
            subTitle: '转换成功',
            buttons: [{
              text: '确定',
              handler: () => {
                this.navCtrl.push(MemberPage);
              }
            }],
            cssClass: 'fwh',
            enableBackdropDismiss:false
          }).present();
        }
      } ,error => {
        this.show = false;
        this.alertCtrl.create({
          title: '提示',
          subTitle: error.json()['Message'],
          buttons: [{
            text: '确定',
            handler: () => {
              this.navCtrl.pop();
            }
          }],
          cssClass: 'fwh',
          enableBackdropDismiss:false
        }).present()
      })
    }
  }

}
