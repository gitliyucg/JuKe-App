import {Component} from '@angular/core';
import {ViewController, NavParams, AlertController, App} from 'ionic-angular';
import {FileService} from "../fileService";
import {Http} from "@angular/http";
import {PassPage} from "../../pages/shezhi/password";
import { Storage } from '@ionic/storage';
@Component({
  template: `
    <ion-grid class="pwc">
      <ion-row>
        <ion-col><ion-icon name="back"></ion-icon></ion-col>
        <ion-col ion-text color="deepgray" text-center>请输入二级密码</ion-col>
        <ion-col ion-text color="primary" text-right (click)="showPrompt('二级')">忘记密码？</ion-col>
      </ion-row>
    </ion-grid>
    <ion-grid class="pwa">
      <ion-row>
        <ion-col><span *ngIf="codeShow[0]">*</span></ion-col>
        <ion-col><span *ngIf="codeShow[1]">*</span></ion-col>
        <ion-col><span *ngIf="codeShow[2]">*</span></ion-col>
        <ion-col><span *ngIf="codeShow[3]">*</span></ion-col>
        <ion-col><span *ngIf="codeShow[4]">*</span></ion-col>
        <ion-col><span *ngIf="codeShow[5]">*</span></ion-col>
      </ion-row>
    </ion-grid>
    <ion-grid class="pww">
      <div class="button-ios-gray">
        <ion-row>
          <ion-col ><button (tap)="toDo('1')" ion-button block>1</button></ion-col>
          <ion-col ><button (tap)="toDo('2')" ion-button block>2</button></ion-col>
          <ion-col ><button (tap)="toDo('3')" ion-button block>3</button></ion-col>
        </ion-row>
        <ion-row>
          <ion-col ><button (tap)="toDo('4')" ion-button block>4</button></ion-col>
          <ion-col ><button (tap)="toDo('5')" ion-button block>5</button></ion-col>
          <ion-col ><button (tap)="toDo('6')" ion-button block>6</button></ion-col>
        </ion-row>
        <ion-row>
          <ion-col ><button (tap)="toDo('7')" ion-button block>7</button></ion-col>
          <ion-col ><button (tap)="toDo('8')" ion-button block>8</button></ion-col>
          <ion-col ><button (tap)="toDo('9')" ion-button block>9</button></ion-col>
        </ion-row>
        <ion-row>
          <ion-col ><button (tap)="toDo('')" class="quxiao" ion-button block>#</button></ion-col>
          <ion-col ><button (tap)="toDo('0')" ion-button block>0</button></ion-col>
          <ion-col ><button (tap)="toDo('x')" class="quxiao" ion-button block><ion-icon name="quxiao"></ion-icon></button></ion-col>
        </ion-row>
      </div>
    </ion-grid>
  `
})
export class PopovercodePage {
  code=[];
  codeShow=[];
  callback;
  password:string;
  uid:string;
  constructor(public viewCtrl: ViewController,
              private params: NavParams,
              private alertCtrl:AlertController,
              private fileService:FileService,
              private http:Http,
              private app:App,
              private storage: Storage,
  ){

    this.storage.get('userStorage').then(value => {
      this.uid = value.uid;
    })

  }
  ionViewDidEnter(){
    this.callback = this.params.get('cb');
  }
  close() {
    this.viewCtrl.dismiss();
  }


  toDo(key){
    if ( key !== ''&&key !== 'x') {
      this.code.push(key);
      this.codeShow.push('*');

      let codelength = this.codeShow.length;
      if (codelength == 6) {
        this.password='';
        for (let i = 0; i < codelength; i++) {
          this.password += this.code[i];
        }
        this.close();
        this.callback(this.password);
      }
    }
    if (key === 'x') {
      this.code.pop()
      this.codeShow.pop();
    }

  }
  showPrompt(url) {
    let prompt = this.alertCtrl.create({
      title: '登录密码验证',
      message: "为了您的数据安全，我们需要验证您的登录密码",
      inputs: [
        {
          name: 'password',
          type:'password',
          placeholder: '登录密码'
        },
      ],
      buttons: [
        {
          text: '取消',
          cssClass:'fwh'
        },
        {
          text: '确定',
          cssClass:'fwh',
          handler: data => {
            if(data.password){
              this.http.get(this.fileService.localUrl + '/action/Users/ValidPass?uid=' + this.uid + '&pass=' + data.password).subscribe(response => {
                let mydata = response.json();
                if (mydata) {
                  this.viewCtrl.dismiss();
                  this.app.getRootNav().push(PassPage, {oldpass: data.password, passType: url});
                } else {
                  this.alertCtrl.create({
                    title: '密码错误',
                    subTitle: '请确认是否输入正确的登录密码',
                    buttons: ['确定'],
                    cssClass: 'fwh'
                  }).present();

                }
              });

            }

          }
        }
      ]
    });
    prompt.present();
  }
}
