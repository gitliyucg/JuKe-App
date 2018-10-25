import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChargePage } from "../charge/charge";
import { Http } from "@angular/http";
import { FileService } from "../../share/fileService";
import { Storage } from "@ionic/storage";
import { TixianPage } from "../caiwu/tixian";
import { RecharageslistPage } from "../recharageslist/recharageslist";
import { Injectable } from '@angular/core';

/**
 * Generated class for the RechargesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Injectable()
@Component({
  selector: 'page-recharges',
  templateUrl: 'recharges.html',
})
export class RechargesPage {

  public UID: number;
  public recharageslistPage: any = RecharageslistPage;
  public chargePage: any = ChargePage;
  public carryPage: any = TixianPage;
  public balance: number;//天天奖励余额
  public UserID: string;
  public ShopBonus: number;
  public TouZiBonus: number;
  public Shouyi: number

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public file: FileService,
    public storage: Storage
    ) {
  }

  ionViewDidLoad() {
    this.storage.get('userStorage').then( value => {
      if (value !== null && value !== 'undefind' && value !== ''){
        this.UserID = value.userid;
        this.http.get(this.file.localUrl + '/action/APPIndex/GetTian?un=' + this.UserID).subscribe( response => {
          this.Shouyi = response.json()['Total'];
          if (response.json()['day'] == 'null'){
            this.ShopBonus = 0;
            this.TouZiBonus= 0;
          }else {
            this.ShopBonus = JSON.parse(response.json()['day'])['ShopBonus'];
            this.TouZiBonus= JSON.parse(response.json()['day'])['TouZiBonus'];
          }
        } )
      }
    } )
    this.Shouyi = this.navParams.get('shouyi')
  }

  toPage(page){
      this.navCtrl.push(page)
  }

}
