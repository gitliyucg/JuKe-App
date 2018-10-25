import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
/**
 * Generated class for the NewsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-tixianview',
  templateUrl: 'tixianview.html',
})
export class TixianviewPage {

  public items: Array<any>;

  constructor(
    public params: NavParams
  ) {
    this.items = this.params.data.data;
  }

  getTime(time){
    if(time) {
      return time.split('T')[0] + ' ' + time.split('T')[1].split('.')[0];
    }

  }

  ionViewDidLoad() {

  }

}


