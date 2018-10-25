import { Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import {NavController, NavParams} from "ionic-angular";
import {FileService} from "../../share/fileService";
import {SubSuccess} from "../succ/success";
import {ShareModule} from "../../share/share.module";
import { Storage } from '@ionic/storage';
@Injectable()



@Component({
  templateUrl: 'baodanSQ.html'
})

export class BaodanSQPage {
  public show: boolean;
  isChange: boolean = false;//头像是否改变标识
  avatarPath1: string = 'assets/img/qr_code.jpg';//用户默认头像
  avatarPath2: string = 'assets/img/qr_code.jpg';//用户默认头像
  imageBase64: string;//保存头像base64,用于上传
  myForm:FormGroup;
  userid:string;
  uid:number;
  dataSheng =[];
  idsheng:string;
  dataShi = [];
  idshi:string;
  dataQu = [];
  Name:string;
  Province:string;
  City:string;
  Citys:string;
  Address:string;
  Areas:string;
  Areac:string;
  Phone:string;
  imgkey:string;
  States:number=100;
  IDNumber:string;
  stateName:string;
  id:number;
  data = this.navparams.get('data');
  constructor(
              private http:Http,
              private formBuilder:FormBuilder,
              private storage: Storage,
              private nav:NavController,
              private fileService: FileService,
              private share:ShareModule,
              private navparams:NavParams) {

    storage.get('userStorage').then(value => {
      this.uid = value.uid;
      this.userid = value.userid;
      this.myForm.controls['UID'].setValue(this.uid);
      this.myForm.controls['UserName'].setValue(this.userid);
    })

    this.Sheng();
    this.myForm=formBuilder.group({
      ID:[0],
      UID:[''],
      UserName:[''],
      Name:['',Validators.required],
      Phone:['', [Validators.required,this.share.mobleValidator]],
      IDNumber: ['', [Validators.required,this.share.idValidator]],
      Province:['',Validators.required],
      City:['',Validators.required],
      Areas:['',Validators.required],
      Address:['',Validators.required],
      Images1:['',Validators.required],
      Images2:['',Validators.required],
      Times:[],
      States:[0]
    });
  }
  ionViewDidEnter() {

          if (this.data) {
            this.States = this.data.States;
            if(this.States===0){
              this.stateName ="审核中";
            }else if(this.States===1){
              this.stateName ="审核未通过";
            }
            this.myForm.controls['States'].setValue(this.data.States);
            this.id = this.data.ID;
            this.myForm.controls['ID'].setValue(this.data.ID);
            this.myForm.controls['Name'].setValue(this.data.Name);
            this.myForm.controls['IDNumber'].setValue(this.data.IDNumber);
            this.myForm.controls['Phone'].setValue(this.data.Phone);
            this.avatarPath1 = this.data.Images1;
            this.avatarPath2 = this.data.Images2;
            this.myForm.controls['Images1'].setValue(this.data.Images1)
            this.myForm.controls['Images2'].setValue(this.data.Images2)
            this.myForm.controls['Address'].setValue(this.data.Address)

          }


  }
//选择省份
  Sheng() {
    for (let i in this.share.diqu['0']) {
      var obj = { name: '', id: '' }
      obj.name = this.share.diqu['0'][i];
      obj.id = i;
      this.dataSheng.push(obj)
    };

  }
  ShengChange(){
    this.City = '';
    this.Areas='';
    this.idsheng = this.myForm.get('Province').value.split('|')[0];
    this.Province = this.myForm.get('Province').value.split('|')[1];

    this.Shi()
  }
  // 选择城市
  Shi() {
    let cityA = [];
    for (let j in this.share.diqu['0,' + this.idsheng]) {
      var obj = { name: '', id: '' }
      obj.name = this.share.diqu['0,' + this.idsheng][j];
      obj.id = j;
      cityA.push(obj)
    };
    this.dataShi = cityA;
  }
  CityChange() {
    this.Areas='';
    this.idshi = this.myForm.get('City').value.split('|')[0];
    this.City = this.myForm.get('City').value.split('|')[1];
    this.Citys = this.City;
    this.Qu()
  }
  //选择地区
  Qu() {
    let quA = [];
    for (let k in this.share.diqu['0,' + this.idsheng + ',' + this.idshi]) {
      var obj = { name: '', id: '' }
      obj.name = this.share.diqu['0,' + this.idsheng + ',' + this.idshi][k];
      obj.id = k;
      quA.push(obj);
    };
    this.dataQu = quA;
  }
  quChange(){
    this.Areac = this.Areas;
  }
  getPicture(type,button) {//1拍照,0从图库选择
    if(button =="Images1"){
      this.imgkey = 'img1';
    }else{
      this.imgkey = 'img2';
    }
    let options = {
      targetWidth: 600,
      targetHeight: 900
    };
    if (type == 1) {
      this.fileService.getPictureByCamera(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    } else {
      this.fileService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    }

  }

  private getPictureSuccess(imageBase64) {
    if(this.imgkey=='img1'){
      this.isChange = true;
      this.imageBase64 = <string>imageBase64;
      this.avatarPath1 = 'data:image/jpeg;base64,' + imageBase64;
      this.myForm.controls['Images1'].setValue(this.avatarPath1)

    }else{
      this.isChange = true;
      this.imageBase64 = <string>imageBase64;
      this.avatarPath2 = 'data:image/jpeg;base64,' + imageBase64;
      this.myForm.controls['Images2'].setValue(this.avatarPath2)
    }

  }

  saveAvatar() {
    this.show = true;
    let timestamp = new Date().toISOString();
    this.myForm.controls['Times'].setValue(timestamp);
    this.myForm.controls['Province'].setValue(this.Province);
    this.myForm.controls['City'].setValue(this.Citys);
    this.myForm.controls['Areas'].setValue(this.Areac);
    this.fileService.showLoading();
    this.fileService.loading.present().then(() => {
      if(this.States===0||this.States===1){
        this.myForm.controls['States'].setValue(0);
        this.http.put(this.fileService.localUrl +'/action/CCMs/Edit/'+this.id, this.myForm.value).toPromise().then(response => {
          let successObj: Object;
          this.fileService.hideLoading();
          if (response.json() == true) {

            successObj = {
              successImg: 'assets/img/succ.png',
              successTitle: '申请成功',
              successBtn2: '返回会员中心'
            }

          } else {
            successObj = {
              successImg: 'assets/img/fail.png',
              successTitle: '申请失败',
              successBtn2: '返回会员中心'
            }
          }
          this.nav.push(SubSuccess, { successObj: successObj});
        })
      }else if(this.States===100){
        this.http.post(this.fileService.localUrl +'/action/CCMs/Applied', this.myForm.value).toPromise().then(response => {
          let successObj: Object;
          this.fileService.hideLoading();
          if (response.json() == true) {

            successObj = {
              successImg: 'assets/img/succ.png',
              successTitle: '申请成功',
              successBtn2: '返回会员中心'
            }

          } else {
            successObj = {
              successImg: 'assets/img/fail.png',
              successTitle: '申请失败',
              successBtn2: '返回会员中心'
            }
          }
          this.nav.push(SubSuccess, { successObj: successObj});
        })
      }



    })
  }

}
