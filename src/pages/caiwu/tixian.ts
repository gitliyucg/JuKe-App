import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import {AlertController, NavController} from "ionic-angular";
import { Storage } from '@ionic/storage';
import {TixianlistPage} from "./tixianlist";
import {SubSuccess} from "../succ/success";
import {FileService} from "../../share/fileService";
import {ShareModule} from "../../share/share.module";
@Injectable()


export class myparamss{
  constructor(
    public PaymentDate:string,
    public ConfirmedDate:string,
    public Type:number,
    public ProcessState:string,
    public BankZhiHang:string,
    public BankNo:string,
    public Name:string,
    public Bank:string,
    public FactReceive:number,
    public ServiceCharge:number,
    public WithdrawalDate:number,
    public WithdrawalAmount:number,
    public UserID:string
  ){}
}
@Component({
  templateUrl: 'tixian.html'
})

export class TixianPage {
  public show: boolean;
  uid:string;
  myForm:FormGroup;
  shouyiyue:number;   //天天收益
  Bank:string;
  BankAccount:string;
  BankZhihang:string;
  Name:string;
  WithdrawConfig:number=0;
  Withdraw:number=0;
  WithdrawInput:number;
  public bool: boolean;
  public max: boolean;
  constructor(public formBuilder:FormBuilder,
              public http:Http,
              private nav:NavController,
              private fileService: FileService,
              private storage: Storage,
              private share:ShareModule,
              private alertCtrl:AlertController

  ) {

    this.myForm=formBuilder.group({
      // WithdrawalAmount: ['',[Validators.required,this.share.sumValidator]],
      WithdrawalAmount: ['',[Validators.required,Validators.pattern('^[1-9]\\d*00$')]],
      // ,[Validators.required,this.share.sumValidator]
      WithdrawalAmounth:[''] //自用提现验证器无需设置
    },{validator:this.getSumValidator});
  }
  ionViewDidEnter(){
    this.storage.get('userStorage').then(value => {
      if(value){
        this.uid = value.userid;

        this.http.get(this.fileService.localUrl+'/action/Users/BankInfo?uid='+this.uid).toPromise().then(res=>{
          let mydata = res.json();
          this.Bank = mydata.Bank;
          this.BankAccount = mydata.BankAccount;
          this.BankZhihang = mydata.BankZhihang;
          this.Name = mydata.Name;
          this.shouyiyue = mydata.Balance;
          this.myForm.controls['WithdrawalAmounth'].setValue(this.shouyiyue);
        })

      }
    })
    this.storage.get('userStorage').then(value => {
      this.http.get(this.fileService.localUrl + '/action/TuiGuang/GetConf/'+value.CID).subscribe(response => {
        let mydata = response.json();
        this.WithdrawConfig = mydata[0].WithdrawConfig;
      })

    })
    }

getSumValidator(g:FormGroup):any{

    let c:FormControl = g.get('WithdrawalAmount') as FormControl;
    let w:FormControl = g.get('WithdrawalAmounth') as FormControl;
    let valid:boolean = (c.value<=w.value);
    return valid ? null : { getSums:true };
}

  change(e){
    if(e.target.value > this.shouyiyue){
      this.max = true;
    }else{
      this.max = false;
    }
  }

  focusInput(){
    this.Withdraw = this.WithdrawConfig/100*this.WithdrawInput;
  }

  totixianList(){
    this.myForm.get('WithdrawalAmount').reset();
    this.nav.push(TixianlistPage,{uid:this.uid});
  }
  saveForm(){
    this.show = true;
    let FactReceive = (this.WithdrawInput - this.Withdraw).toFixed(2);
    let ServiceCharge = this.Withdraw.toFixed(2);
    let timestamp = new Date().getTime();
    let params = new myparamss('','',0,'正在处理中',this.BankZhihang,this.BankAccount,this.Name,this.Bank,parseFloat(FactReceive),parseFloat(ServiceCharge),timestamp,this.WithdrawInput,this.uid);
    this.fileService.showLoading();
    this.fileService.loading.present().then(() => {
      this.http.post(this.fileService.localUrl + '/action/Withdrawals/PostWithdrawal', params).toPromise().then(response => {
        this.show = true;
        let successObj: Object;
        this.myForm.get('WithdrawalAmount').reset();
        this.fileService.hideLoading();
        if (response.json() == "操作成功！") {

          successObj = {
            successImg: 'assets/img/succ.png',
            successTitle: '提现成功',
            successBtn2: '返回会员中心'
          }
        } else {
          successObj = {
            successImg: 'assets/img/fail.png',
            successTitle: '提现失败',
            successBtn2: '重新提现'
          }
        }
        this.nav.push(SubSuccess, {uid: this.uid, successObj: successObj});

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
