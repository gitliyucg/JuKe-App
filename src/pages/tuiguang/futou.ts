import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { NavController,AlertController} from "ionic-angular";
import {FileService} from "../../share/fileService";
import {SubSuccess} from "../../pages/succ/success";
import { Storage } from '@ionic/storage';
import {ShareModule} from "../../share/share.module";
import {FutouListPage} from "./futoulist";
@Injectable()
export class myparamss{
  constructor(
    public un:string,
    public num:number,
    public money:number,
    public tian:number,
    public dong:number
  ){}
}
@Component({
  templateUrl: 'futou.html'
})


export class FutouPage {
  public show: boolean;
  uid:string;
  myForm:FormGroup;
  baodanNum:number =1; //当前激活用户报单数
  dongtaiyue:number; //动态余额
  shouyiyue:number;   //天天收益
  baodanyue:number;  //报单余额
  dane:number;
  zonge:number;
  needshouyiyue:number=0; //自己填写的天天收益余额
  needdongtaiyue:number=0;//自己填写的动态奖励余额
  needbaodanyue:number=0; //自己填写的报单余额
  BaoDanConfig:number;    //报单金额比
  OtherConfig:number;     //天天动态组合金额比
  minbaodan:number;       //报单最小金额    报单总额*报单金额比
  minzuhe:any;            //组合最小金额    报单总额-报单最小金额
  needzuhe:any;           //组合金额    当前填写的天天动态组合加值
  needmin:any;            //帮助用户获知最后还差多少金额   总额-用户填写的报单+天天+动态
  constructor(public formBuilder:FormBuilder,
              public http:Http,
              private nav:NavController,
              private alertCtrl: AlertController,
              private fileService: FileService,
              private storage: Storage,
              private share:ShareModule) {

    this.myForm=formBuilder.group({
      baodanNum:['',[Validators.required,this.share.IntValidator]],
      zuheGroup: formBuilder.group({
      dongtaiyue: [''],
      shouyiyue: [''],
      needshouyiyue: ['',this.share.flValidator],
      needdongtaiyue: ['',this.share.flValidator],
      minzuhe:[''],
      needzuhe:['']
    }, {validator: this.zuheyanzhen}),
      baodanGroup: formBuilder.group({
      needbaodanyue: ['', [this.share.flValidator]],
      minbaodan: [''],
      baodanyue: ['']
    }, {validator: this.baodanyanzhen})
  });


  }

  ionViewWillEnter(){
    this.storage.get('userStorage').then(value => {
      this.http.get(this.fileService.localUrl + '/action/TuiGuang/GetConf/'+value.CID).subscribe(response => {
        let mydata = response.json();
        this.dane = mydata[0].BaoDan;
        this.zonge = this.share.accMul(this.dane, this.baodanNum);
        this.BaoDanConfig = mydata[0].BaoDanConfig;
        this.OtherConfig = mydata[0].OtherConfig;
        this.minbaodan = Math.ceil(this.zonge * this.BaoDanConfig) / 100;
      })
      this.uid = value.userid;
      this.http.get(this.fileService.localUrl +'/action/Users/GetYue?uid=' + this.uid).subscribe(res => {
        let mydata = res.json();
        this.dongtaiyue = mydata.dongtai;
        this.shouyiyue = mydata.tiantian;
        this.baodanyue = mydata.RegBalance;
      })
    })

  }
  focusbaodan(){
    this.zonge = this.share.accMul(this.dane,this.baodanNum);
    this.minbaodan =  Math.ceil(this.zonge*this.BaoDanConfig)/100;
    this.needzuhe = this.share.accAdd(this.needshouyiyue,this.needdongtaiyue);
    this.minzuhe = this.share.Subtr(this.zonge,this.needbaodanyue);
    let needmin = this.share.accAdd(this.needzuhe,this.needbaodanyue);
    this.needmin = this.share.Subtr(this.zonge,needmin);

  }
  focuszuhe(){
    this.needzuhe = this.share.accAdd(this.needshouyiyue,this.needdongtaiyue);
    this.minzuhe = this.share.Subtr(this.zonge,this.needbaodanyue);
    let needmin = this.share.accAdd(this.needzuhe,this.needbaodanyue);
    this.needmin = this.share.Subtr(this.zonge,needmin);
  }
  focusInput(){
    this.needzuhe = this.share.accAdd(this.needshouyiyue,this.needdongtaiyue);
    this.minzuhe = this.share.Subtr(this.zonge,this.needbaodanyue);
    let needmin = this.share.accAdd(this.needzuhe,this.needbaodanyue);
    this.needmin = this.share.Subtr(this.zonge,needmin);

  }
  baodanyanzhen(g:FormGroup):any{
    let s:FormControl = g.get('needbaodanyue') as FormControl;
    let c:FormControl = g.get('minbaodan') as FormControl;
    let b:FormControl = g.get('baodanyue') as FormControl;
    let valid:boolean = (s.value>=c.value&&s.value<=b.value);
    return valid ? null : { getbaodan:true };
  }
  zuheyanzhen(g:FormGroup):any{
    let ns: FormControl = g.get('needshouyiyue') as FormControl;
    let nd: FormControl = g.get('needdongtaiyue') as FormControl;
    let d: FormControl = g.get('dongtaiyue') as FormControl;
    let s: FormControl = g.get('shouyiyue') as FormControl;
    let nz: FormControl = g.get('needzuhe') as FormControl;
    let z: FormControl = g.get('minzuhe') as FormControl;
    let valid: boolean = (ns.value <= s.value && nd.value <= d.value && nz.value == z.value);
    return valid ? null : {getzuhe: true};

  }
  showConfirm(){
    this.show = true;
    let confirm = this.alertCtrl.create({
      title: '',
      cssClass:'alertClass',
      message: '您确定复投吗？',
      enableBackdropDismiss:false,
      buttons: [
        {
          text: '取消',
          cssClass:'canBtn',
          handler: () => {
            this.show = false;
          }
        },
        {
          text: '确定',
          cssClass:'sureBtn',
          handler: () => {
            this.fileService.showLoading();
            let thisbaodan:number = this.needbaodanyue;
            let thisshouyiyue:number = this.needshouyiyue;
            let thisdongtaiyue:number = this.needdongtaiyue;
            let params = new myparamss(this.uid,this.baodanNum,thisbaodan,thisshouyiyue,thisdongtaiyue);
            this.fileService.loading.present().then(() => {
              this.http.post(this.fileService.localUrl +'/action/TuiGuang/FuTou', params).toPromise().then(response => {
                let successObj: Object;
                this.fileService.hideLoading();
                if (response.json() == true) {
                  successObj = {
                    successImg: 'assets/img/succ.png',
                    successTitle: '复投成功',
                    successBtn2: '返回会员中心'
                  }

                } else {
                  this.show = false;
                  successObj = {
                    successImg: 'assets/img/fail.png',
                    successTitle: '复投失败',
                    successBtn2: '返回会员中心'
                  }
                }
                this.nav.push(SubSuccess, {uid: this.uid, successObj: successObj});
              }, error => {

                if (error.json().Message) {
                  this.alertCtrl.create({
                    title: '提示',
                    subTitle: error.json().Message,
                    buttons: ['确定'],
                    cssClass: 'fwh'
                  }).present();
                  this.show = false;
                  this.fileService.hideLoading();
                    return false;
                }
              });
            })
          }
        }
      ]
    });
    confirm.present();
  }
  tofutouList(){
    this.nav.push(FutouListPage);
  }
}
