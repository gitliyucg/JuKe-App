import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Content } from "ionic-angular";
import {Http} from "@angular/http";
import { Storage } from "@ionic/storage";
import { FileService } from "../../share/fileService";
import { Injectable } from '@angular/core';
import { AlertController } from "ionic-angular";

/**
 * Generated class for the ConsumptionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Injectable()
@Component({
  selector: 'page-consumption',
  templateUrl: 'consumption.html',
})
export class ConsumptionPage {
  @ViewChild(Content) content: Content;

  public UserID: string;
  public pageNum: number = 1;
  public gouwu: number;
  public fanli: number;
  public items = [];
  showKey:boolean=true; //防止滚动条事件一直执行
  key:boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public storage: Storage,
    public fileService: FileService,
    public alertCtrl: AlertController
  ) {
  }

  scrollHandler(event){
    if(this.content.scrollTop>400&&this.showKey){
      this.showKey = false;
      document.getElementById('toTop').style.display="block";
    }else if(this.content.scrollTop<400&&!this.showKey){
      this.showKey = true;
      document.getElementById('toTop').style.display="none";
    }
  }

  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
  }

  ionViewDidLoad() {
    this.storage.get('userStorage').then( value => {
      this.UserID = value.userid;
      this.http.get(this.fileService.localUrl + '/action/MondyDetails/GetAppShopList?u='+this.UserID+'&num=' + this.pageNum).subscribe( response =>{
        this.items = JSON.parse(response.json()['data']);
      } )
      this.http.get(this.fileService.localUrl + '/action/APPIndex/GetICE?un=' + this.UserID).subscribe( response =>{
        if (response.json().day == 'null' || response.json().day == 'undefined' || response.json().day == ''){
          this.fanli = 0;
        }else {
          this.fanli = JSON.parse(response.json().day)['ICE']
        }
      } )
    } )
    this.gouwu = this.navParams.get('gouwu');
  }

  doInfinite(infiniteScroll){
    if( this.items.length != 0 ){
      if (this.key) {
        setTimeout(() => {
          this.pageNum++;
          this.http.get(this.fileService.localUrl + '/action/MondyDetails/GetAppShopList?u='+this.UserID+'&num=' + this.pageNum).toPromise().then(response => {
            let mydata = JSON.parse(response.json()['data']);
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
    }else {
      infiniteScroll.complete();
    }
  }

}
