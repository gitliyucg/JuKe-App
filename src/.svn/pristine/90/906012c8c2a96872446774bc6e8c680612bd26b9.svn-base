import { Component} from '@angular/core';
import { Injectable } from '@angular/core';
import {FileService} from "../../share/fileService";
import {NavParams} from "ionic-angular";
@Injectable()


@Component({
  templateUrl: 'baodaninfo.html'
})

export class BaodanInfoPage {
  data = this.navparams.get('data');
  avatarPath: string;
  avatarPathback:string;
  Name:string;
  IDNumber:string;
  Province:string;
  City:string;
  Address:string;
  Areas:string;
  Phone:string;

  constructor(
              private file:FileService,
              private navparams:NavParams
   ) {




  }
  ionViewDidEnter() {
    if (this.data) {
      this.Name = this.data.Name;
      this.IDNumber = this.data.IDNumber;
      this.Province = this.data.Province;
      this.City = this.data.City;
      this.Address = this.data.Address;
      this.Areas = this.data.Areas;
      this.Phone = this.data.Phone;
      this.avatarPath = this.data.Images1;
      this.avatarPathback = this.data.Images2;

    }

  }

}
