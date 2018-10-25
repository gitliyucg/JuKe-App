import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import {PopoverController,NavController,AlertController} from "ionic-angular";
import { PopovercodePage} from '../../share/pagination/popovercode';
import {JifenlistPage} from "./jifenlist";
import {ShareModule} from "../../share/share.module";
import {FileService} from "../../share/fileService";
import {SubSuccess} from "../../pages/succ/success";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/debounceTime';
@Injectable()
@Component({
  templateUrl: 'jifen.html'
})


export class JifenPage {
  public bool: boolean = true;
  public show: boolean;
  public shouyiShow;
  public type: string;
  public moneySum: number;
  uid:string;
  public userID = new FormControl();
  myForm:FormGroup;
  dongtaiyue:number; //动态余额
  shouyiyue:number;   //天天收益
  regBalance:number;  //报单余额
  username:string;
  maxNumber: boolean = false; //交易数额超出验证提示
  AcceptUserId: string;
  constructor(
    public formBuilder:FormBuilder,
    public http:Http,
    private pop:PopoverController,
    private nav:NavController,
    private share:ShareModule,
    private alertCtrl: AlertController,
    private fileService: FileService,
    private storage: Storage,
  ) {

    this.bool = true;
    this.myForm = formBuilder.group({
      AcceptUserName: [''],
      myuid: [],
      userID: ['', Validators.required],
      MoneySum:[0,Validators.compose([Validators.pattern("^\\+?[1-9]\\d*$"), Validators.required])],
      TransferType:[]
    });
    // this.storage.get('userStorage').then( value => {
    //   this.username = value['Name'];
    // } )
    this.myForm.get('userID').valueChanges.debounceTime(1000).subscribe( value => {
      this.http.get(this.fileService.localUrl+'/action/Users/GetName?un=' + value).subscribe(res => {
        this.username = res.json();
      },error => {
        this.username = '';
      })
    } )
  }

  ionViewWillEnter(){
    this.storage.get('userStorage').then(value => {
      if(value){
        this.uid = value.userid;
        this.http.get(this.fileService.localUrl+'/action/Users/GetYue?uid=' + this.uid).toPromise().then(res => {
          let mydata = res.json();
          this.dongtaiyue = mydata.dongtai;
          this.shouyiyue = mydata.tiantian;
          this.regBalance = mydata.RegBalance;
          this.shouyiShow = this.shouyiyue;
        })
      }
    })
  }
  hehe(e) {
    this.type = e;
    if(e == '天天奖励')
    {
      this.shouyiShow = this.shouyiyue;
    }else if(e == '动态奖励')
    {
      this.shouyiShow = this.dongtaiyue;
    }else if(e == '报单金额')
    {
      this.shouyiShow = this.regBalance;
    }
  }

  validMax(e) {
    this.moneySum = e.target.value;
    if(e.target.value > this.shouyiShow)
    {
      this.maxNumber = true;
    }else {
      this.maxNumber = false;
    }
  }

  uidValidator(g:FormGroup):any{
    let s:FormControl = g.get('userID') as FormControl;
    let c:FormControl = g.get('myuid') as FormControl;

    let valid:boolean = (s.value!=c.value);
    return valid ? null : { thisuid:true };
  }
  showConfirm(password) {
    this.show = true;
      let confirm = this.alertCtrl.create({
        title: '',
        cssClass: 'alertClass',
        message: '您确定转账吗？',
        enableBackdropDismiss:false,
        buttons: [
          {
            text: '取消',
            cssClass: 'canBtn',
            handler: () => {
              this.show = false;
            }
          },
          {
            text: '确定',
            cssClass: 'sureBtn',
            handler: () => {
              if(this.bool){
                this.bool = false;
              }else {
                this.alertCtrl.create({
                  title: '提示',
                  cssClass: 'alertClass',
                  message: '操作频繁，请稍后重试',
                  buttons: [
                    {
                      text: '确定',
                      cssClass: 'canBtn',
                      handler: () => {
                        this.nav.pop();
                      }
                    }
                  ]
                }).present();
                return false;
              }
              this.fileService.showLoading();
              this.fileService.loading.present().then(() => {
                this.http.get(this.fileService.localUrl+'/action/Users/VerifyPass?un=' + this.uid + '&pass=' + password).subscribe(response => {
                  if (response.json()==true) {
                    if (this.type == undefined){
                      this.type = '天天奖励';
                    }else{
                      this.type = this.type;
                    }
                    let params:object = {
                        uid:this.uid,
                        oid:this.myForm.get('userID').value,
                        on:this.username,
                        mt:this.type,
                        money:this.moneySum
                    }
                    this.http.post(this.fileService.localUrl+'/action/JiFenHZ/ZhuanZeng', params).timeout(60000).subscribe(response => {
                      let successObj: Object;
                      this.fileService.hideLoading();
                      if (response.json() == true) {
                        successObj = {
                          successImg: 'assets/img/succ.png',
                          successTitle: '转账成功',
                          successBtn2: '返回会员中心'
                        }

                      }
                      this.nav.push(SubSuccess, {successObj: successObj});
                    },error => {
                      if (error.json().Message) {
                        this.show = false;
                        this.alertCtrl.create({
                          title: '提示',
                          subTitle: error.json().Message,
                          buttons: [{
                            text: '确定',
                            cssClass: 'fwh',
                            handler: () => {
                              this.nav.pop();
                            }
                          }],
                        }).present();
                      }
                    });

                  } else {
                    this.bool = true;
                    this.fileService.hideLoading();
                    this.alertCtrl.create({
                      title: '密码错误',
                      subTitle: '请确认是否输入正确的二级密码',
                      buttons: ['确定'],
                      cssClass: 'fwh'
                    }).present();
                    this.show = false;
                  }
                });
              })
            }
          }
        ]
      });
    confirm.present();
  }
  codePopover(myEvent) { //弹出二级密码输入框
    this.show = true;
    let popover = this.pop.create(PopovercodePage, {
      cb: this.showConfirm.bind(this)
    }, {cssClass: 'codeClass'});
    popover.present({
      ev: myEvent
    });
  }

  tojifenList(){
    this.nav.push(JifenlistPage);
  }

}
