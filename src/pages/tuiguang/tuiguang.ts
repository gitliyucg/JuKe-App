import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import { MemberregPage } from "./memberreg";
import { MemberlistPage } from "./memberlist";
import { GuanxiPage } from "./guanxi";
import { FutouPage } from "./futou";
import {BaodanInfoPage} from "./baodaninfo";
import {Storage} from "@ionic/storage";
import {BaodanSQPage} from "./baodanSQ";
import { Http} from '@angular/http';
import {FileService} from "../../share/fileService";
@Component({
  templateUrl: '../member/pagelist.html',
  styles: ['.item-block { margin: 0.5rem 0;}']
})

export class TuiGuangPage {
  pageTitle = "我的推广";
  data:any;
  lists: Array<any> = [
    { name: '会员注册', url: MemberregPage, icon: 'huiyuanzhuce' },
    { name: '关系导图', url: GuanxiPage, icon: 'guanxidaotu' },
    { name: '报单中心', url: '', icon: 'shenqingbaodan'},
    { name: '复投', url: FutouPage, icon: 'futou' }
  ];
  constructor(public nav: NavController,private http: Http,private storage:Storage,private fileService:FileService) {

  }
  ionViewDidLoad(){
    this.storage.get('userStorage').then(value => {
      if(value.isBaodan == 1){
        this.lists.push({ name: '会员列表', url: MemberlistPage, icon: 'huiyuanliebiao' });
      }
      // if(value.CID!=='1'){
      //   this.lists.push();
      // }
    })
  }
  ionViewDidEnter() {

    this.storage.get('userStorage').then(value => {
      this.http.get(this.fileService.localUrl +'/action/CCMs/GetView/'+value.uid).subscribe(res=>{
        if(res.json().States===2){
          this.data = res.json();
          for(let i=0;i<this.lists.length;i++){
            if(this.lists[i].name=="报单中心"){
              this.lists[i].url = BaodanInfoPage;
            }
          }
        }else if(res.json().States===0||res.json().States===1){
          this.data = res.json();
          for(let i=0;i<this.lists.length;i++){
            if(this.lists[i].name=="报单中心"){
              this.lists[i].url = BaodanSQPage;
            }
          }

        }else{
          for(let i=0;i<this.lists.length;i++){
            if(this.lists[i].name=="报单中心"){
              this.lists[i].url = BaodanSQPage;
            }
          }
        }
      })
    })

  }
  toNewPage(url) {
    if(this.data){
      this.nav.push(url,{data:this.data});
    }else{
      this.nav.push(url);
    }

  }
}
