import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Http} from "@angular/http";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HelplistPage} from "./helplist";
import {FileService} from "../../share/fileService";
import {ShareModule} from "../../share/share.module";
import {NavController,NavParams,AlertController} from "ionic-angular";

@Component({
  templateUrl:'myfeed.html',
})

export class MyFeedPage {
  items = [];
  Contents: string;
  TypeName: string;
  States: number;
  Phone: string;
  uid: string;
  myForm: FormGroup;
  mys: any;
  id = this.navParams.get('id');

  constructor(private http: Http,
              private storage: Storage,
              private formBuilder: FormBuilder,
              private fileService: FileService,
              private share: ShareModule,
              private nav: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController) {


    this.myForm = formBuilder.group({
      Contents: ['', Validators.required]
    });
  }
  ionViewDidLoad(){
    this.storage.get('userStorage').then(value => {
      this.uid = value.userid;
      this.http.get(this.fileService.localUrl + '/action/FeedBacks/GetView/' + this.id + '?un=' + this.uid).toPromise().then(response => {
        let mydata = response.json();
        this.mys = JSON.parse(mydata.data);
        this.Contents = this.mys.Contents;
        this.TypeName = this.mys.TypeName;
        this.States = this.mys.States;
        this.Phone = this.mys.Phone;
        this.items = JSON.parse(mydata.reply);

      });
    })

  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }
  feedBack() {

    let timestamp = new Date().getTime();
    let params = {
      FID: this.id,
      Reply: this.myForm.get('Contents').value,
      ReplyName: this.uid,
      ReplyTimes: this.share.formatDate(timestamp, true)
    }
    if (params) {
      this.fileService.showLoading();
      this.fileService.loading.present().then(() => {
        this.http.post(this.fileService.localUrl + '/action/FeedTexts/PostFeedText/', params).toPromise().then(response => {


          if (response.json() == true) {
            this.http.get(this.fileService.localUrl + '/action/FeedBacks/GetView/' + this.id + '?un=' + this.uid).toPromise().then(response => {
              this.fileService.hideLoading();
              let mydata = response.json();
              this.items = JSON.parse(mydata.reply);
            });
            this.myForm.get('Contents').reset();
          }
        })
      })
    }
  }

  feedClose() {
    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertClass',
      message: '您确定关闭此次反馈吗？',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: '取消',
          cssClass: 'canBtn',
          handler: () => {
          }
        },
        {
          text: '确定',
          cssClass: 'sureBtn',
          handler: () => {
            this.mys.States = 2;
            this.fileService.showLoading();
            this.fileService.loading.present().then(() => {
              this.http.put(this.fileService.localUrl + '/action/FeedBacks/PutFeedBack/' + this.id, this.mys).toPromise().then(response => {
                this.fileService.hideLoading();
                this.nav.push(HelplistPage);
              })
            })
          }

        }
      ]
    });
    confirm.present();
  }
}
