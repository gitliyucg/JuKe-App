import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {FileService} from "../../share/fileService";
import { Storage } from '@ionic/storage';
@Injectable()

@Component({
  templateUrl: 'guanxi.html'

})


export class GuanxiPage {
  ALevel:any;
  BLevel:any;
  CLevel:any;
  items=[];
  constructor( public http: Http,private storage: Storage,private fileService:FileService) {

  }
  ionViewDidLoad() {
    this.storage.get('userStorage').then(value => {
      if (value) {
        this.http.get(this.fileService.localUrl +'/action/TuiGuang/Mind?un='+value.userid).toPromise().then(response => {
          let mydata = response.json();

          this.ALevel = JSON.parse(mydata.ALevel);
          this.BLevel = JSON.parse(mydata.BLevel);
          this.CLevel = JSON.parse(mydata.CLevel);
          let Blength = this.BLevel.length;
          let Clength = this.CLevel.length;
          for(var i=0;i<Blength;i++){
            this.items[i]=[];
            this.BLevel[i].value=false;
            for(let j=0;j<Clength;j++){
              if(this.BLevel[i].UserID == this.CLevel[j].RefereeMobile){
                this.items[i].push(this.CLevel[j])

              }
            }

          }
        });
      }
    })

  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }
  zhankai(index){
    if(!this.BLevel[index].value){
      this.BLevel[index].value=true;
    }else {
      this.BLevel[index].value=false;
    }

  }
}
