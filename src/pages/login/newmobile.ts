import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController,NavController,NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileService} from "../../share/fileService";
import { ShareModule } from '../../share/share.module';
import {AnquanPage} from "../shezhi/anquan";
@Injectable()

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>修改手机号</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="myForm" class="jifen yanzhengButton">

      <ion-list>
        <ion-item>
          <ion-label>新手机号</ion-label>
          <ion-input type="number" value="" formControlName="newmobile" placeholder="输入新的手机号码" [(ngModel)]="newmobile"></ion-input>
        </ion-item>
        <div [hidden]="myForm.get('newmobile').untouched" class="error">
          <p [hidden]="!myForm.hasError('mobile','newmobile')" no-margin>
            <ion-icon name="alert" float-left isActive="false"></ion-icon>
            <span>请输入正确的手机号码</span>
          </p>
        </div>
        <ion-row>
          <ion-col>
            <ion-item no-lines>
              <ion-input type="text" value="" formControlName="code" placeholder="输入验证码" [(ngModel)]="code"></ion-input>
            </ion-item>
          </ion-col>
          <ion-col>
              <button (click)="toCode()" block *ngIf="codeClick">获取验证码</button>
              <button block *ngIf="codeShow">{{codeCon}}</button>
          </ion-col>
        </ion-row>
      </ion-list>
      </form>
      <div padding>
        <button ion-button block (click)="toTel()" [disabled]= myForm.invalid>确认修改</button>
      </div>
    </ion-content>
  `
})


export class NewMobilePage {
  myForm:FormGroup;
  newmobile:string;
  code:string;
  codeClick:boolean = true;
  codeShow:boolean =false;
  codeCon = "正在发送";
  myCode:string;
  countdown:number=60;
  uid:string;
  constructor(public http: Http,
              private alertCtrl:AlertController,
              private formBuilder:FormBuilder,
              private nav:NavController,
              public navParams:NavParams,
              private fileService:FileService,
              private share:ShareModule) {

    this.uid = this.navParams.get('uid');
    this.myForm = formBuilder.group({
      newmobile:['',[Validators.required, this.share.mobleValidator]],
      code:['',Validators.required]

    });
  }

  toTel(){
    if(this.code!=this.myCode){
      this.alertCtrl.create({
        title: '提示',
        subTitle: '验证码错误，请检查验证码是否正确或者重新获取',
        buttons: ['确定'],
        cssClass:'fwh'
      }).present();
      return false;
    }else{
      let newmobile = {tel:this.newmobile}
      this.fileService.showLoading();
      this.fileService.loading.present().then(() => {
        this.http.post(this.fileService.localUrl + '/action/Login/EditPhone/' + this.uid, newmobile).subscribe(response => {
          this.fileService.hideLoading();
          if (response.json() == true) {
            this.alertCtrl.create({
              title: '修改成功',
              subTitle: '您已经绑定新的手机号',
              buttons: [{
                text: '确定',
                handler: () => {
                  this.nav.push(AnquanPage);
                }
              }],
              cssClass: 'fwh'
            }).present();

          } else {
            this.alertCtrl.create({
              title: '出错啦',
              subTitle: '请确认网络是否接连，或者重新尝试更改密码',
              buttons: ['确定'],
              cssClass: 'fwh'
            }).present();
          }
        });
      })
    }

  }
  toCode() {
    this.http.get(this.fileService.localUrl + '/action/Login/GetMess?tel='+this.newmobile).subscribe(data=>{
      let mydata = JSON.parse(data.json());

      if(mydata.code==200) {
        this.myCode = mydata.obj;
        this.codeClick = false;
        this.codeShow = true;
        let ssg = setInterval(() => {
          this.codeCon = this.countdown + "秒后重新发送";
          this.countdown--;
          if (this.countdown == 0) {
            this.codeClick = true;
            this.codeShow = false;
            this.countdown = 60;
            this.codeCon = "正在发送";
            clearInterval(ssg);
          }
        }, 1000)
      }
    });

  }
}
