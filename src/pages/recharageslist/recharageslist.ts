import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import { Storage } from "@ionic/storage";
import { FileService } from "../../share/fileService";
import { Content } from "ionic-angular";
import { Injectable } from '@angular/core';

/**
 * Generated class for the RecharageslistPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Injectable()
@Component({
  selector: 'page-recharageslist',
  templateUrl: 'recharageslist.html',
})
export class RecharageslistPage {
  @ViewChild(Content) content: Content

  public UserID: string;
  public pageNum: number = 1;
  public showKey: boolean = true; //防止滚动条事件一直执行
  public items = [];
  public key: boolean = true;

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
      this.UserID = value.userid;
      this.http.get(this.fileService.localUrl + '/action/MondyDetails/GetAppDay?u='+this.UserID+'&num=' + this.pageNum).subscribe( response => {
        this.items = JSON.parse(response.json()['data']);
      } )
    } )
  }

  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
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

  doInfinite(infiniteScroll){
    if (this.key){
      setTimeout( () =>{
        this.pageNum++;
        this.http.get(this.fileService.localUrl + '/action/MondyDetails/GetAppDay?u='+this.UserID+'&num=' + this.pageNum).subscribe( response => {
          let mydata = JSON.parse(response.json()['data']);
          if (mydata.length == 0){
            this.key = false;
          }else {
            for (let data of mydata){
              this.items.push(data)
            }
          }
          infiniteScroll.complete();
        } )
      }, 800 )
    }else{
      infiniteScroll.complete();
    }
  }

}
