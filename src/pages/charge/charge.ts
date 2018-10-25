import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { FileService } from "../../share/fileService";
import { Http } from "@angular/http";
import { AlertController } from "ionic-angular";
import { SubSuccess } from "../succ/success";
import { Storage } from "@ionic/storage";
import { ShareModule } from "../../share/share.module";
import { ChargelistPage } from "../chargelist/chargelist";

/**
 * Generated class for the ChargePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Injectable()
@Component({
  selector: 'page-charge',
  templateUrl: 'charge.html',
})

export class ChargePage {

  public show: boolean;
  public myForm: FormGroup;
  isChange: boolean = false;//头像是否改变标识
  avatarPath: string = 'assets/img/qr_code.jpg';//用户默认头像
  imageBase64: string;//保存头像base64,用于上传
  public TID: number = 0;
  public UID: number;
  public UserID: string;

  constructor(
    public http: Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public nativeService: FileService,
    public fileService: FileService,
    public alertCtrl: AlertController,
    public storage: Storage,
    public share: ShareModule
    ) {
    this.myForm = formBuilder.group({
      Amount: ['', [Validators.required, this.share.IntValidator]],
      MessageContent: [''],
      Pic: ['', Validators.required],
    })
  }

  getPicture(type) {//1拍照,0从图库选择
    let options = {
      targetWidth: 600,
      targetHeight: 900
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    }

  }

  private getPictureSuccess(imageBase64) {
    this.isChange = true;
    this.imageBase64 = <string>imageBase64;
    this.avatarPath = 'data:image/jpeg;base64,' + imageBase64;
    this.myForm.controls['Pic'].setValue("ok")
  }

  ionViewDidLoad() {
    this.storage.get('userStorage').then( value => {
      this.UID = value.uid;
    } )
  }

  saveAvatar() {
    this.show = true;
    let timestamp = new Date();
    this.fileService.showLoading();
    this.fileService.loading.present().then(() => {
      this.http.post(this.fileService.localUrl + '/action/Recharges/PostRecharge', {UID: this.UID, TID: 0, Money: this.myForm.get('Amount').value, Message: this.myForm.get('MessageContent').value, Times: timestamp, Pic: this.avatarPath}).toPromise().then(response => {
        this.show = true;
        let successObj: Object;
        this.fileService.hideLoading();
        if (response.json() == true) {
          successObj = {
            successImg: 'assets/img/succ.png',
            successTitle: '等待审核',
            successBtn2: '返回会员中心'
          }
        } else {
          this.show = false;
          successObj = {
            successImg: 'assets/img/fail.png',
            successTitle: '充值失败',
            successBtn2: '重新充值'
          }
        }
        this.navCtrl.push(SubSuccess, { successObj: successObj});

      }, error => {
        this.show = false;
        if (error.json().Message) {
          this.alertCtrl.create({
            title: '提示',
            subTitle: error.json().Message,
            buttons: ['确定'],
            cssClass: 'fwh'
          }).present();
          this.fileService.hideLoading();
          return false;
        }
      })
    })
  }

  tochargeList(){
    this.navCtrl.push(ChargelistPage)
  }

}
