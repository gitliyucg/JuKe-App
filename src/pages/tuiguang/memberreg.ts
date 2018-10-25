import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {FileService} from "../../share/fileService";
import {ShareModule} from "../../share/share.module";
import {AlertController, NavController} from "ionic-angular";
import {SubSuccess} from "../succ/success";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/debounceTime';
@Injectable()

@Component({
  templateUrl: 'memberreg.html'
})

export class MemberregPage {
  public show: boolean;
  myForm: FormGroup;
  banks = [];
  OpeningBank:string;
  FuTouDan:number;
  BaoDanSum:number;
  uid:string;
  BanDanCenter:string;
  RefereeMobile:string;
  public RefereeName : string;
  constructor(
    public formBuilder: FormBuilder,
    public http: Http,
    private fileService:FileService,
    private share:ShareModule,
    private nav:NavController,
  private storage:Storage,
  private alertCtrl:AlertController) {
    this.myForm = formBuilder.group({
      UserID: ['', [Validators.required, Validators.pattern('^[A-z][0-9A-z]{3,9}$')]],
      Name: ['', Validators.required],
      BaoDanSum: ['', Validators.required],
      BaoDanSumH: [''],
      IDNumber: ['', [Validators.required,this.share.idValidator]],
      Mobile: ['', [Validators.required,this.share.mobleValidator]],
      OpeningBank: ['', Validators.required],
      BankAccount: ['', Validators.required],
      BankZhihang: ['', Validators.required],
      Password: ['', [Validators.required,this.share.passFValidator]],
      SecondaryPassword: ['', [Validators.required,this.share.passSValidator]],
      RefereeMobile: ['', Validators.required],
      RefereeName: ['', Validators.required],
      BanDanCenter: ['', Validators.required],
      RegistUser: [0]
    },{validator:this.getSumValidator});

    this.storage.get('userStorage').then( value => {
      this.RefereeName = value['Name'];
    } )

  }
  getSumValidator(g:FormGroup):any{
    let w:FormControl = g.get('BaoDanSumH') as FormControl;
    let c:FormControl = g.get('BaoDanSum') as FormControl;
    let valid:boolean = (c.value<=w.value&&c.value>0);
    return valid ? null : { getSums:true };
  }
  ionViewDidLoad() {
    this.storage.get('userStorage').then(value => {
      if (value) {
        this.uid = value.userid;
        if(value.isBaodan==1){
          this.BanDanCenter = value.userid;
        }else{
          this.BanDanCenter = value.BCenter;
        }
        this.RefereeMobile = value.userid;
        this.http.get(this.fileService.localUrl + '/action/TuiGuang/GetConf/'+value.CID).subscribe(response => {
          let mydata = response.json();
          this.FuTouDan = mydata[0].FuTouDan;
          this.myForm.controls['BaoDanSumH'].setValue(this.FuTouDan);
        })
      }
    })
    this.myForm.get('RefereeMobile').valueChanges.debounceTime(1000).subscribe(value => {
      this.http.get(this.fileService.localUrl + '/action/Users/GetName?un=' + value).subscribe(res => {
        this.RefereeName=res.json();
      }, error => {
        this.RefereeName = '';
      })
    })
    this.http.get(this.fileService.localUrl +'/action/Banks/GetBank').subscribe(response => {
      this.banks = response.json();
    });
  }
  saveForm(event) {
    this.show = true;
    event.preventDefault();
    var params = {
        BanDanCenter: this.myForm.get('BanDanCenter').value,
        BankAccount: this.myForm.get('BankAccount').value,
        BankZhihang: this.myForm.get('BankZhihang').value,
        BaoDanSum: this.myForm.get('BaoDanSum').value,
        IDNumber: this.myForm.get('IDNumber').value,
        Mobile: this.myForm.get('Mobile').value,
        Name: this.myForm.get('Name').value,
        OpeningBank: this.myForm.get('OpeningBank').value,
        Password: this.myForm.get('Password').value,
        RefereeMobile: this.myForm.get('RefereeMobile').value,
        SecondaryPassword: this.myForm.get('SecondaryPassword').value,
        UserID: this.myForm.get('UserID').value,
        RegistUser: this.uid
    }
    this.fileService.showLoading();
    this.fileService.loading.present().then(() => {
      this.http.post(this.fileService.localUrl +'/action/Users/Register', params).toPromise().then(res => {
        let successObj: Object;

        if (res.json() == "注册成功") {
          successObj = {
            successImg: 'assets/img/succ.png',
            successTitle: '注册成功',
            successBtn2: '返回会员中心'
          }

        } else {
          this.show = false;
          successObj = {
            successImg: 'assets/img/fail.png',
            successTitle: '注册失败',
            successBtn2: '重新注册'
          }
        }
        this.fileService.hideLoading();
        this.nav.push(SubSuccess, {uid: this.uid, successObj: successObj});

      }, error => {

        if (error.json().Message) {
          this.show = false;
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


