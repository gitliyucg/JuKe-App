import { Component,ViewChild } from '@angular/core';
import { Http, } from '@angular/http';
import {FileService} from "../../share/fileService";
import { Storage } from '@ionic/storage';
import {Content, NavController, NavParams} from 'ionic-angular';


/**
 * Generated class for the StockclistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-stockclist',
  templateUrl: 'stockclist.html',
})
export class StockclistPage {

  @ViewChild(Content) content:Content;
  items = [];
  Pagenum: any;
  showKey:boolean=true; //防止滚动条事件一直执行
  key:boolean = true;
  public UID;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public file: FileService,
    public storage: Storage
  ) {
  }

  ionViewDidLoad() {

    this.Pagenum = 1;
    this.file.showLoading();
    this.storage.get('userStorage').then(value => {
      this.UID = value['userid'];
      this.file.loading.present().then(() => {
        this.http.get(this.file.localUrl + '/action/GuQuan/GetBuyList/' + this.UID + '?num=' + this.Pagenum).toPromise().then(response => {
          this.items = JSON.parse(response.json().data);
          console.log(this.items[0])
          console.log(this.items[0])
          this.file.hideLoading();
          this.key = true;
        });
      })
    })

  }

  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
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

  doInfinite(infiniteScroll, UID){
    if (this.key) {
      setTimeout(() => {
        this.Pagenum++;
        this.http.get(this.file.localUrl + '/action/GuQuan/GetBuyList/' + this.UID + '?num=' + this.Pagenum).toPromise().then(response => {
          let mydata = JSON.parse(response.json().data);
          if (mydata.length == 0) {
            this.key = false;
          }else {
            for (let data of mydata) {
              this.items.push(data);
            }
          }
          infiniteScroll.complete();
        });
      }, 800);
    }else{
      infiniteScroll.complete();
    }
  }

}
