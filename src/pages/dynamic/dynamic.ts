import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Content } from "ionic-angular";
import { Http, URLSearchParams } from "@angular/http";
import { Storage } from "@ionic/storage";
import { FileService } from "../../share/fileService";
import { Injectable } from '@angular/core';

/**
 * Generated class for the DynamicPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Injectable()
@Component({
  selector: 'page-dynamic',
  templateUrl: 'dynamic.html',
})
export class DynamicPage {
  @ViewChild(Content) content:Content;

  public showKey: boolean = true; //防止滚动条事件一直执行
  public params =  new URLSearchParams()
  public pageNum: number = 1;
  public UserID: string;
  public response = [];
  public key: boolean = true;
  public dongtai: number;
  public UID: number;
  public Day: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public storage: Storage,
    public fileService: FileService
    ) {
  }

  ionViewDidLoad() {
    this.storage.get('userStorage').then( value => {
      this.UserID = value['userid'];
      this.http.get(this.fileService.localUrl + '/action/MondyDetails/GetAppDongTaiList?u='+this.UserID+'+&num='+this.pageNum).subscribe( response =>{
        this.response = JSON.parse(response.json()['data']);
      } )
      this.http.get(this.fileService.localUrl + '/action/APPIndex/GetDong?un=' + this.UserID).subscribe( response => {
        if (response.json()['day'] == 'null'){
          this.Day = 0;
        }else {
          this.Day = response.json()['day'];
        }
      } )
    } )
    this.dongtai = this.navParams.get('dongtai')
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

  doInfinite(infiniteScroll){
    if (this.key){
      setTimeout(() => {
        this.pageNum++;
        this.http.get(this.fileService.localUrl + '/action/MondyDetails/GetAppDongTaiList?u='+this.UserID+'+&num='+this.pageNum).subscribe( response => {
          let myData = JSON.parse(response.json()['data']);
          if (myData.length == 0){
            this.key = false
          }else {
            for (let data of myData) {
              this.response.push(data);
            }
          }
          infiniteScroll.complete();
        } )
      }, 800)
    }else {
      infiniteScroll.complete();
    }
  }

}
