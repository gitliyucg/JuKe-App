import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController,NavController,NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { PassPage } from '../shezhi/password';
import { NewMobilePage } from '../login/newmobile';
import {FileService} from "../../share/fileService";
@Injectable()

@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <button menuToggle>
          <ion-icon name="menu"></ion-icon>
        </button>
        <ion-title>获取验证码</ion-title>
      </ion-navbar>
    </ion-header>
    <ion-content>
      <form [formGroup]="myForm" class="jifen yanzhengButton">
      <ion-list>
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
        <button ion-button block (click)="toTel()" [disabled]= myForm.invalid>下一步</button>
      </div>
    </ion-content>
  `
})


export class MobilePage {
  myForm:FormGroup;
  mobile:string;
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
              private file:FileService) {
    this.mobile = this.navParams.get('mobile');
    this.uid = this.navParams.get('uid');
    this.myForm = formBuilder.group({

      code:['',Validators.required]

    });
  }

  toTel(){
    let url = this.navParams.get('url');
    if(this.code!=this.myCode){
      this.alertCtrl.create({
        title: '提示',
        subTitle: '验证码错误，请检查验证码是否正确或者重新获取',
        buttons: ['确定'],
        cssClass:'fwh'
      }).present();
      return false;
    }else{
      if(url=="find"){
        this.nav.push(PassPage,{passType:"找回",uid:this.uid});
      }else if(url=="mobile"){
        this.nav.push(NewMobilePage,{uid:this.uid});
      }

    }

  }
  toCode() {
    this.http.get(this.file.localUrl + '/action/Login/GetMess?tel='+this.mobile).subscribe(data=>{
      let mydata = JSON.parse(data.json());

        if(mydata.code==200){
          this.myCode= mydata.obj;
          this.codeClick=false;
          this.codeShow=true;
          let ssg = setInterval(() => {
            this.codeCon = this.countdown+"秒后重新发送";
            this.countdown--;
            if(this.countdown==0){
              this.codeClick=true;
              this.codeShow=false;
              this.countdown=60;
              this.codeCon="正在发送";
              clearInterval(ssg);
            }
          },1000)

        }


    });

  }
}
