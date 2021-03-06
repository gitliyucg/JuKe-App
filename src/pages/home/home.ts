import { Component,ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import {App, Platform, Slides} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FileService } from "../../share/fileService";
import { ListChild } from "../listchild/listchild";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('mySlider') mySlider: Slides;

  num;
  items = [];
  slides = [];
  constructor(
    private http: Http,
    private fileService: FileService,
    public storage: Storage,
    private app:App,
    private platform:Platform
  ) {


  }
  autoPlay(){
    this.mySlider.startAutoplay();
  }
  ionViewWillEnter(){
    this.slides=[];
  }
  ionViewDidEnter() {

    this.num = 1;
    this.http.get(this.fileService.localUrl+'/action/mall/GetList?num=' + this.num).subscribe(response => {
      if (response.ok) {
        let mydata = response.json();
        this.items = JSON.parse(mydata.data);
      }
    },error => {
      alert(JSON.parse(error).Message)
      this.platform.exitApp();
    });

    this.http.get(this.fileService.localUrl+'/action/mall/GetList?num=' + this.num).subscribe(response => {
      if (response.ok) {
        let mydata = response.json();
        this.items = JSON.parse(mydata.data);
      }
    },error => {
      alert('出现问题了，请检查网络或重新打开APP')
      this.platform.exitApp();
    });

    // 获取轮播
    this.http.get(this.fileService.localUrl+'/action/Products/Banner').subscribe(response => {
      let mydata = response.json();
      this.slides = JSON.parse(mydata.banner);
    }, error => {
    })
  }
  doInfinite(infiniteScroll) { // 上拉刷新
    setTimeout(() => {
      this.num += 1
      this.http.get(this.fileService.localUrl+'/action/mall/GetList?num=' + this.num).subscribe(response => {
        let items2 = JSON.parse(response.json().data);
        if (items2.length == 0) {
          infiniteScroll.enable(false);
        }
        for (let data of items2) {
          this.items.push(data);
        }
        infiniteScroll.complete();
      });
    }, 800);
  }

  toIndex(){
    let end = this.mySlider.getActiveIndex();
    if(end>this.slides.length){
      end = end-this.slides.length;
    }
    this.toNews(this.slides[end-1].ID)

  }
  toNews(id) {  // 点击轮播，跳到相应产品详情页
            for (let i = 0; i < this.slides.length; i++) {
              if (this.slides[i].ID == id) {
                let item = this.slides[i];
                this.app.getRootNav().push(ListChild, {item})
              }
            }
  }
  selectItem(item){   // 将选择的产品传入子组件
            this.app.getRootNav().push(ListChild, {item})
  }
}
