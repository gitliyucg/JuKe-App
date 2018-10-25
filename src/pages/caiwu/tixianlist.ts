import { Component,ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { PopovernumPage } from '../../share/pagination/popover';
import {  PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {FileService} from "../../share/fileService";
import {Content } from 'ionic-angular';
import { TixianviewPage } from "./tixianview";
import { NavController } from 'ionic-angular';
import { AlertController } from "ionic-angular";

@Injectable()

@Component({
  templateUrl: 'tixianlist.html',

})
export class TixianlistPage {
  @ViewChild(Content) content:Content;
  public show: boolean = false;
  items = [];
  uid: string;
  tixianType: string = '';
  startDate: string = '';
  endDate: string = '';
  pagenum: any;
  showKey:boolean=true; //防止滚动条事件一直执行
  key:boolean = true;
  constructor(
    private http: Http,
    private pop: PopoverController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private file:FileService,
    private nav: NavController,
    public alertControll: AlertController
    ) {
    }
  ionViewDidLoad() {
    this.storage.get('userStorage').then(value => {
      if (value) {
        this.uid = value.userid;
        this.pagenum = 1;
        this.file.showLoading();
        this.file.loading.present().then(() => {
          this.http.get(this.file.localUrl + '/action/Withdrawals/GetList?uid=' + this.uid).toPromise().then(response => {
            let mydata = response.json();
            this.items = JSON.parse(mydata.data);
            this.file.hideLoading();
          });
        })
      }
    })
  }
  selectPopover(myEvent) { //弹出select选项

    let popover = this.pop.create(PopovernumPage, {
      item: [{ name: '正在处理中', id: '1' }, { name: '已拒绝', id: '2' }, { name: '已转账', id: '3' }, { name: '所有状态', id: '4' }],
      title: '转账类型',
      cb: this.getjifenType.bind(this)  //绑定组件this
    }, { cssClass: 'selectClass' });
    popover.present({
      ev: myEvent
    });

  }

  newsPage(data){
    this.nav.push(TixianviewPage,{data})
  }

  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }
  getjifenType(x, y) {
    this.tixianType = y;
  }
  scrollHandler(event){  //滚动控制返回顶部按钮

    if(this.content.scrollTop>400&&this.showKey){
      this.showKey = false;
      document.getElementById('toTop').style.display="block";

    }else if(this.content.scrollTop<400&&!this.showKey){
      this.showKey = true;
      document.getElementById('toTop').style.display="none";

    }

  }
  dataSearch() {
    if(this.startDate||this.endDate||this.tixianType) {
      this.pagenum = 1;
      let url = '';
      if (this.startDate) {
        url += '&sd=' + this.startDate;
      }
      if (this.endDate) {
        url += '&ed=' + this.endDate;
      }
      if (this.tixianType == '正在处理中' ||this.tixianType ==  '已拒绝' ||this.tixianType ==  '已转账') {
        url += '&state=' + this.tixianType;
      }
      this.file.showLoading();
      this.file.loading.present().then(() => {
        this.http.get(this.file.localUrl + '/action/Withdrawals/GetList?uid=' + this.uid + url + '&num=' + this.pagenum).subscribe(response => {
          let mydata = response.json();
          this.items = JSON.parse(mydata.data);
          this.file.hideLoading();
          this.key = true;
        });
      })
    }
  }
  doInfinite(infiniteScroll){
      if (this.key) {
          setTimeout(() => {
              this.pagenum++;
              let url = '';
              if (this.startDate) {
                  url += '&sd=' + this.startDate;
              }
              if (this.endDate) {
                  url += '&ed=' + this.endDate;
              }
              if (this.tixianType == '正在处理中' || this.tixianType == '已拒绝' || this.tixianType == '已转账') {
                  url += '&state=' + this.tixianType;
              }

              this.http.get(this.file.localUrl + '/action/Withdrawals/GetList?uid=' + this.uid + url + '&num=' + this.pagenum).toPromise().then(response => {
                  let mydata = response.json();
                  let mydatas = JSON.parse(mydata.data);
                  if (mydatas.length == 0) {
                      this.key = false;
                  }else {
                      for (let data of mydatas) {
                          this.items.push(data);
                      }
                  }
                  infiniteScroll.complete();
              });
          }, 500);
      }else{
          infiniteScroll.complete();
      }
  }
      cancelTixian(num) {
          this.show =true;
          this.http.delete(this.file.localUrl + '/action/Tixian/quxiao/' + num).subscribe(response => {
              let mydata = response.json();
              if (mydata == "操作成功") {
                  let toast = this.toastCtrl.create({
                      message: '删除成功',
                      duration: 1000,
                      position: 'middle',
                      cssClass: 'toastClass'
                  });
                  toast.onDidDismiss(() => {
                      for (var i = 0; i < this.items.length; i++) {
                          if (num == this.items[i].WithdrawalID) {
                              this.items.splice(i, 1);
                          }
                      }
                  });
                  toast.present();
              }
          }, error2 => {
              this.alertControll.create({
                  title: '提示',
                  subTitle: JSON.parse(error2['_body'])['Message'],
                  buttons: [{
                      text: '确定',
                      handler: () => {
                          this.nav.push(TixianlistPage);
                      }
                  }]
              }).present()
          });
      }
}

