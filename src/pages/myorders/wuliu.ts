import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, NavController } from 'ionic-angular';
import { FileService } from "../../share/fileService";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MemberPage } from "../member/member"
@Component({
    templateUrl: 'wuliu.html'
})
export class orderWuliu {


    myForm:FormGroup;
    id = this.navParams.get('id');
    constructor(
        public formBuilder:FormBuilder,
        public http: Http,
        public navParams: NavParams,
        private file: FileService,
        public nav: NavController,
    ) {
      this.myForm = formBuilder.group({
        wuliuName:['', Validators.required],
        wuliuCode:['', Validators.required]
      })
    }

  subwuliu(event) {
      let wuname = this.myForm.get('wuliuName').value;
      let wucode = this.myForm.get('wuliuCode').value;
      this.file.showLoading();
      this.file.loading.present().then(() => {
        this.http.put(this.file.localUrl + '/action/OrdersReturns/KuaiDi/' + this.id, {id: this.id, KDname: wuname, KDID: wucode}).toPromise().then(response => {
          this.file.hideLoading();
          if (response.json() == true) {
            this.nav.push(MemberPage)
          }
        });

      })
  }

}


