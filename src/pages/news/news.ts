import { Component,ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import {App, Platform, Slides} from "ionic-angular";
import {NewPage} from "./new";
import {FileService} from "../../share/fileService";
import {Content } from 'ionic-angular';

@Component({
	templateUrl: 'news.html'
})

export class NewsPage {
  @ViewChild(Content) content:Content;
  @ViewChild('mySlider') mySlider: Slides;
	items=[];
  slides = [];
  pagenum = 1;
  showKey:boolean=true; //防止滚动条事件一直执行
	constructor(private http: Http,private app:App,private fileService:FileService,private platform:Platform) {

	}
  autoPlay(){
    this.mySlider.startAutoplay();
  }
  ionViewWillEnter(){
    this.slides=[];
  }
  ionViewDidEnter(){
    this.http.get(this.fileService.localUrl + '/action/News/GetList?num=1').subscribe(response => {
      let mydata = response.json();
      this.items = JSON.parse(mydata.data);
    },error => {
      alert('出现问题了，请检查网络或重新打开APP')
      this.platform.exitApp();
    });
    this.http.get(this.fileService.localUrl + '/action/News/Banner').subscribe(response => {
      let mydata = response.json();
      this.slides = JSON.parse(mydata.banner);
    });

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
  doInfinite(infiniteScroll) {
      setTimeout(() => {
        this.pagenum++;
        this.http.get(this.fileService.localUrl + '/action/News/GetList?num=' + this.pagenum).subscribe(response => {
          let mydata = JSON.parse(response.json().data);
          if (mydata.length == 0) {
            infiniteScroll.enable(false);
          }else {
            for (let data of mydata) {
              this.items.push(data);
            }
          }
          infiniteScroll.complete();

        });
      }, 500);
    }
  toIndex(){

    let end = this.mySlider.getActiveIndex();
    if(end>this.slides.length){
        end = end-this.slides.length;
    }
    this.toNewPage(this.slides[end-1].ID)

  }
  toNewPage(id){
      this.app.getRootNav().push(NewPage,{id:id,type:'news'})
  }
  getTime(time){
    if(time) {
      return time.split('T')[0];
    }

  }
}
