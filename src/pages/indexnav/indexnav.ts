import { Component,ViewChild} from '@angular/core';
import { NewsPage } from '../news/news';
import { HomePage } from '../home/home';
import { NavParams, Tabs} from "ionic-angular";
import {MemberPage} from "../member/member";
@Component({
  templateUrl: 'indexnav.html'
})
export class IndexnavPage {

  @ViewChild('myTabs') tabRef:Tabs;
  tab1Root = HomePage;
  tab2Root = NewsPage;
  tab3Root = MemberPage;
  page = this.navparams.get('page');
  constructor(
    private navparams:NavParams) {

  }

  ionViewWillEnter() {

    if(this.page===0||this.page===1||this.page===2){
      this.tabRef.select(this.page);
    }

  }
  tab1(){
    this.page=0;
  }
  tab2(){
    this.page=1;
  }
  tab3(){
    this.page=2;
  }
}
