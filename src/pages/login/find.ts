import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController,NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MobilePage } from './mobile';
import { ShareModule } from '../../share/share.module';
import {FileService} from "../../share/fileService";
@Injectable()

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>找回密码</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="myForm" class="jifen">
      <ion-list>
        <ion-item>
          <ion-label>用户名</ion-label>
          <ion-input type="text" value="" formControlName="username" placeholder="请输入您的用户名" [(ngModel)]="username"></ion-input>
        </ion-item>
        <ion-item no-lines>
          <ion-label>手机号</ion-label>
          <ion-input type="number" value="" formControlName="mobile" placeholder="请输入注册时的手机号" [(ngModel)]="mobile"></ion-input>
        </ion-item>
        <div [hidden]="myForm.get('mobile').untouched" class="error">
          <p [hidden]="!myForm.hasError('mobile','mobile')" no-margin>
            <ion-icon name="alert" float-left isActive="false"></ion-icon>
            <span>请输入正确的手机号码</span>
          </p>
        </div>
      </ion-list>
      </form>
      <div padding>
        <button ion-button block (click)="toTel()" [disabled]= myForm.invalid>下一步</button>
      </div>
    </ion-content>
  `
})


export class FindPage {
  myForm:FormGroup;
  username:string;
  mobile:string;

  constructor(public http: Http,
              private alertCtrl:AlertController,
              private formBuilder:FormBuilder,
              private nav:NavController,
              private share:ShareModule,
              private file:FileService) {
    this.myForm = formBuilder.group({

      username:['',Validators.required],
      mobile:['',[Validators.required, this.share.mobleValidator]]

    });
  }
  toTel() {
    this.http.get(this.file.localUrl + '/action/Login/ValidPhone?un='+this.username+'&tel='+this.mobile).subscribe(data=>{
        let mdata=data.json();
        if(mdata=="账号或手机错误"){
          this.alertCtrl.create({
            title: '提示',
            subTitle: '用户名和手机号不匹配，请检查用户名或者手机号是否输入有误，如有疑问请联系客服',
            buttons: ['确定'],
            cssClass:'fwh'
          }).present();
          return false;
        }else{
          this.nav.push(MobilePage,{mobile:this.mobile,uid:mdata,url:'find'});
        }


    });

  }
}
