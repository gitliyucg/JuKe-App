import { Component } from '@angular/core';
import {  ViewController } from 'ionic-angular';
import { Http } from '@angular/http';

import {  App } from "ionic-angular";
import { QueRen } from '../querendingdan/querendingdan';


@Component({
  templateUrl: 'fenxiang.html'
})
export class FenXiang {

  constructor(

    public view: ViewController,
    public http: Http,

    private app: App
  ) {}
  close() {  //关闭选择规格的模态框
    this.view.dismiss();
  }
  gouMakeSure(shuju, tiao, uid) {   // 跳到确认订单页面
    this.app.getRootNav().push(QueRen, { shuju, tiao, uid });
  }
}

