import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import {FileService} from "../../share/fileService";
@Injectable()

@Component({
  templateUrl: 'jifenlist.html'
})
export class JifenlistPage {
  items=[];
  items2=[];
  nums=[];
  nums2=[];
  uid:string;
  huzhuan: string = "zhuanru";

    constructor(private http: Http,private storage: Storage,private file: FileService,) {
      storage.get('userStorage').then(value => {
        if (value) {
          this.uid = value.userid;
          this.file.showLoading();
          this.file.loading.present().then(() => {
            this.http.get(this.file.localUrl+'/action/MoneyTransfers/GetZhuanRu?uid=' + this.uid + '&num=1').toPromise().then(response => {
              let mydata = response.json();
              this.items = JSON.parse(mydata.data);

                let total = Math.ceil((mydata.total) / 20);
                for (let i = 1; i <= total; i++) {
                  this.nums.push({id: i, name: '第' + i + '页'})
                }

              this.file.hideLoading();
            });
          })
          this.http.get(this.file.localUrl+'/action/MoneyTransfers/GetZhuanChu?uid=' + this.uid + '&num=1').toPromise().then(response => {
            let mydata = response.json();
            this.items2 = JSON.parse(mydata.data);
            let total = Math.ceil((mydata.total) / 20);
            for (let i = 1; i <= total; i++) {
              this.nums2.push({id: i, name: '第' + i + '页'})
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
    doSearch(num){
      let thisurl='GetZhuanRu';
      if(this.huzhuan=="zhuanchu"){
        thisurl = 'GetZhuanChu'
      }
      this.file.showLoading();
      this.file.loading.present().then(() => {
        this.http.get(this.file.localUrl + '/action/MoneyTransfers/' + thisurl + '?uid=' + this.uid + '&num=' + num).toPromise().then(response => {
          let mydata = response.json();

          if (this.huzhuan == "zhuanchu") {
            this.items2 = JSON.parse(mydata.data);
          } else {
            this.items = JSON.parse(mydata.data);
          }
          this.file.hideLoading();
        });
      })
    }



}


