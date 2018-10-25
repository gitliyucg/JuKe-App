import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {Http} from "@angular/http";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HelplistPage} from "./helplist";
import {FileService} from "../../share/fileService";
import {ShareModule} from "../../share/share.module";
import {NavController} from "ionic-angular";
import {SubSuccess} from "../succ/success";
export class myparamss{
  constructor(
    public UserID:string,
    public TypeName:string,
    public Contents:string,
    public Phone:string,
    public Times:string,
    public States:number
  ){}
}
@Component({
  templateUrl:'myhelp.html',
})

export class MyhelpPage {
  uid:string;
  myForm:FormGroup;
  constructor(
    private http: Http,
    private storage: Storage,
    private formBuilder:FormBuilder,
    private fileService:FileService,
    private share:ShareModule,
  private nav:NavController) {

    storage.get('userStorage').then(value => {
        this.uid = value.userid;

    })
    this.myForm = formBuilder.group({
      Contents:['',Validators.required],
      TypeName:['',Validators.required],
      Phone:['',Validators.required]
    });
  }
  feedBack(){

    let timestamp = new Date().getTime();
    let params = new myparamss(this.uid,this.myForm.get('TypeName').value,this.myForm.get('Contents').value,this.myForm.get('Phone').value,this.share.formatDate(timestamp,true),0);
    if(params){
    this.fileService.showLoading();
    this.fileService.loading.present().then(() => {
      this.http.post(this.fileService.localUrl +'/action/FeedBacks/PostFeedBack', params).toPromise().then(response => {
        let successObj: Object;

        this.fileService.hideLoading();
        if (response.json() == true) {

          this.nav.push(HelplistPage);
        } else {
          successObj = {
            successImg: '/assets/img/fail.png',
            successTitle: '提交失败',
            successBtn2: '重新提交',
            successUrl2: ''
          }
          this.nav.push(SubSuccess, {uid: this.uid, successObj: successObj});
        }


      });
    })
  }
  }
}
