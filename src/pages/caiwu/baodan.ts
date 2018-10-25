import { Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import {AlertController, NavController} from "ionic-angular";
import {BaodanlistPage} from "./baodanlist";
import {FileService} from "../../share/fileService";
import {SubSuccess} from "../succ/success";
import {ShareModule} from "../../share/share.module"
import { Storage } from '@ionic/storage';
@Injectable()


export class myparamss{
  constructor(
    public TID: number,
    public UserID: string,
    public MessageTime:string,
    public Amount:number,
    public ProcessState:string,
    public MessageContent:string,
    public ReplyContent:string,
    public ReplyTime:string,
    public Remark:string,
    public Pic:string,
    //public PrepaidAccount:string
  ){}
}
@Component({
  templateUrl: 'baodan.html'
})

export class BaodanPage {
  public show: boolean;
  public UserID: string;
  isChange: boolean = false;//头像是否改变标识
  avatarPath: string = 'assets/img/qr_code.jpg';//用户默认头像
  imageBase64: string;//保存头像base64,用于上传
  //avatarPath='';
  selectNav=['积分充值','现金充值'];
  myForm:FormGroup;
  //bankAccount:string; //银行账户
  uid:string;
  un:string;
  constructor(
    private nativeService: FileService,
    private http:Http,
    private formBuilder:FormBuilder,
    private storage: Storage,
    private nav:NavController,
    private fileService: FileService,
    private share:ShareModule,
    private alertCtrl:AlertController) {


    this.myForm=formBuilder.group({
      TID: ['', Validators.required],
      // UserID:['',[Validators.required]],
      // PrepaidAccount:['',Validators.required],
      Amount:['',[Validators.required,this.share.IntValidator]],
      MessageContent:['',Validators.required],
      // Pic:['',Validators.required]
    });
  }
  ionViewWillEnter() {
    this.storage.get('userStorage').then(value => {
      this.uid = value.uid;
      this.un = value.userid;
    })
    // this.http.get(this.fileService.localUrl+'/action/CompanyBanks/GetList').subscribe(res=>{
    //     this.selectNav=res.json()
    // });
    this.storage.get('userStorage').then( response => {
        this.UserID = response.userid
    } )
  }

  tobaodanList(){
        this.nav.push(BaodanlistPage);
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

  saveAvatar() {
    this.show = true;
    let timestamp = new Date().getTime();
    let params = new myparamss(this.myForm.get('TID').value,this.UserID,this.share.formatDate(timestamp,true),parseInt(this.myForm.get('Amount').value),'正在处理中',this.myForm.get('MessageContent').value,'','','',this.avatarPath);
    this.fileService.showLoading();
    this.fileService.loading.present().then(() => {
      this.http.post(this.fileService.localUrl + '/action/Deposits/PostDeposit', params).toPromise().then(response => {
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
          successObj = {
            successImg: 'assets/img/fail.png',
            successTitle: '充值失败',
            successBtn2: '重新充值'
          }
        }
        this.nav.push(SubSuccess, { successObj: successObj});

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

}
