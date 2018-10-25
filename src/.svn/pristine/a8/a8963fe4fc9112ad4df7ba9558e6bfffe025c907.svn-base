import { Component } from '@angular/core';
import { PopoverController, NavParams, NavController, ModalController } from 'ionic-angular';
import { App, AlertController, ToastController } from 'ionic-angular';
import { addShouHuo } from '../addShouHuo/addShouHuo';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { FileService } from "../../share/fileService";


class Item {
  constructor(
    public ID: number,
    public UID: number,
    public Name: string,
    public Phone: string,
    public Province: string,
    public City: string,
    public Areas: string,
    public Address1: string,
    public State: number
  ) { }
}
@Component({
  templateUrl: 'dizhiguanli.html',
})
export class DiZhiGuanLi {
  uid;
  items: Item[];
  newDizhi;
  constructor(
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public nav: NavController,
    private app: App,
    public http: Http,
    public alertCtrl: AlertController,
    public storage: Storage,
    private toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private file: FileService
  ) {
    this.newDizhi = navParams.data;
    this.storage.get('userStorage').then(value => {   // 获取UID
      this.uid = value.uid;
      this.http.get(this.file.localUrl + '/action/Addresses/GetList?uid=' + this.uid).toPromise().then(res => {
        this.items = res.json()
      })
    })
  }
  addshouhuo(items) {  //添加收货地址,传递的是整个地址数据数组
    this.nav.push(addShouHuo, {
      type: "添加收货地址", items
    });
  }
  bainji(childItem) {  //编辑收货地址，传递的是当前的地址数据
    this.nav.push(addShouHuo, {
      type: "编辑地址", childItem
    });
  }

  shanchu(id, i, items) {   // 删除地址
    let confirm = this.alertCtrl.create({
      title: '',
      cssClass: 'alertClass',
      message: '确定要删除地址吗？',
      enableBackdropDismiss:false,
      buttons: [
        { text: '取消',
          cssClass: 'canBtn'
        },
        {
          text: '确定',
          cssClass: 'sureBtn',
          handler: (items) => {  //上传删除数据并重新获取地址列表,handler不需要小括号传参
            this.http.delete(this.file.localUrl + '/action/Addresses/Delete/' + id).toPromise().then(response => {
              if (response.json() == true) {
                for (let i = 0; i < this.items.length; i++) {
                  if (this.items[i].ID == id) {
                    this.items.splice(i, 1)
                  }
                }
              }
            });
          }
        }
      ]
    });
    confirm.present();
  }
  changeMoRen(id) {    // 修改默认地址
    this.http.put(this.file.localUrl + '/action/Addresses/SetDefault/' + id, { uid: this.uid }).subscribe(data => {
      this.presentToast()
      this.http.get(this.file.localUrl + '/action/Addresses/GetList?uid=' + this.uid).toPromise().then(res => {
        let k;        // 设置地址列表排序，将默认地址排到最上
        k = res.json();
        for (let i = 0; i < k.length - 1; i++) {
          for (let j = 0; j < i; j++) {
            if (k[i].State > k[j].State) {
              let arr = k[i];
              k[i] = k[j];
              k[j] = arr;
            }
          }
        }
        this.items = k;
      })
    })
  }
  presentToast() {    // 默认地址修改成功提示
    let toast = this.toastCtrl.create({
      message: '修改成功！',
      duration: 2000,
      position: 'middle',
      cssClass: 'toastClass'
    });
    toast.onDidDismiss(() => {
    });
    toast.present();
  }

  ionViewDidEnter() {    //  切换到当前页面立即执行（刷新、执行方法都可以）
    this.http.get(this.file.localUrl + '/action/Addresses/GetList?uid=' + this.uid).toPromise().then(res => {
      let k;
      k = res.json();
      for (let i = 0; i < k.length - 1; i++) {
        for (let j = 0; j < i; j++) {
          if (k[i].State > k[j].State) {
            let arr = k[i];
            k[i] = k[j];
            k[j] = arr;
          }
        }
      }
      this.items = k;
    })
  }

}

