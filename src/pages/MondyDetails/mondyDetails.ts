import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {FileService} from "../../share/fileService";
@Injectable()

@Component({
  templateUrl: 'mondyDetails.html'
})


export class MondyDetailsPage {
  items = [];
  nums = [];
  u: string;
  t: string;
  constructor(private http: Http, private navParams: NavParams,private file:FileService) {
    this.u = navParams.get('u');
    this.t = navParams.get('t');

    this.file.showLoading();
    this.http.get(this.file.localUrl+'/action/MondyDetails/Liushui?un=' + this.u + '&sd=' + this.t + '&num=1').toPromise().then(response => {
      let mydata = response.json();
      this.items = JSON.parse(mydata.data);
      let total = Math.ceil((mydata.total) / 20);
      for (let i = 1; i <= total; i++) {
        this.nums.push({ id: i, name: '第' + i + '页' })
      }
      this.file.hideLoading();
    });
  }
  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }
  }
  doSearch(num) {
    this.file.showLoading();
    this.http.get(this.file.localUrl+'/action/MondyDetails/Liushui?un=' + this.u + '&sd=' + this.t + '&num=' + num).toPromise().then(response => {
      let mydata = response.json();
      this.items = JSON.parse(mydata.data);
      this.file.hideLoading();
    });

  }
}

