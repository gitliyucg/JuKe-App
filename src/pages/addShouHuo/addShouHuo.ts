import { Component} from '@angular/core';
import {
	PopoverController, NavParams, NavController, AlertController
} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { ShareModule } from '../../share/share.module';
import {FileService} from "../../share/fileService";


@Component({
	templateUrl: 'addShouHuo.html',
})
export class addShouHuo {
	dizhibainjicanshu;  // 用来判断是添加还是编辑地址
	dizhibianji: string;   // 控制标题的显示文字

	myForm: FormGroup;
	UID: number;
	Name: string;
	Phone: string;
	Province: string;
	City: string;
	Areas: string;
	Address1: string;
	State: number;

  dataSheng =[];
  idsheng:string;
  dataShi = [];
  idshi:string;
  dataQu = [];

	constructor(
		public navParams: NavParams,
		public nav: NavController,
		public alerCtrl: AlertController,
		public pop: PopoverController,
		public formBuilder: FormBuilder,
		public http: Http,
		private storage: Storage,
		private share: ShareModule,
    private file: FileService
	) {

		this.dizhibainjicanshu = navParams.data;  //获取父组件传来的数据
		this.myForm = formBuilder.group({    // 初始化数据组
			UID: ['', Validators.required],
			Name: ['', Validators.required],
			Phone: ['', [Validators.required, this.share.mobleValidator]],
			Province: ['', Validators.required],
			City: ['', Validators.required],
			Areas: ['', Validators.required],
			Address1: ['', Validators.required],
			State: [0, Validators.required]
		});
	}
	ngOnInit() {
    this.Sheng();
		if (this.dizhibainjicanshu.type == '编辑地址') {    //编辑地址
			this.dizhibianji = '编辑地址';
			//读取被编辑的地址数据并付给表单
			this.Name = this.dizhibainjicanshu.childItem.Name;
			this.Phone = this.dizhibainjicanshu.childItem.Phone;
			this.Province = this.dizhibainjicanshu.childItem.Province;
			this.City = this.dizhibainjicanshu.childItem.City;
			this.Areas = this.dizhibainjicanshu.childItem.Areas;
			this.Address1 = this.dizhibainjicanshu.childItem.Address1;
			this.State = this.dizhibainjicanshu.childItem.State;
			this.UID = parseInt(this.dizhibainjicanshu.childItem.UID);

			this.myForm.controls['Name'].setValue(this.Name);
			this.myForm.controls['Phone'].setValue(this.Phone);
			this.myForm.controls['Province'].setValue(this.Province);
			this.myForm.controls['City'].setValue(this.City);
			this.myForm.controls['Areas'].setValue(this.Areas);
			this.myForm.controls['Address1'].setValue(this.Address1);
			this.myForm.controls['State'].setValue(this.State);
      this.myForm.controls['UID'].setValue(this.UID);

		} else
			if (this.dizhibainjicanshu.type == '添加收货地址') {   //添加收货地址
				this.dizhibianji = '添加收货地址';
				this.storage.get('userStorage').then(value => {   // 获取UID
            this.UID = parseInt(value.uid);
            this.myForm.controls['UID'].setValue(this.UID);
				})
			}
	}
  //选择省份
  Sheng() {
    for (let i in this.share.diqu['0']) {
      var obj = { name: '', id: '' }
      obj.name = this.share.diqu['0'][i];
      obj.id = i;
      this.dataSheng.push(obj)
    };
  }
  ShengChange(){
    this.City = '';
    this.Areas='';
    this.idsheng = this.myForm.get('Province').value.split('|')[0];
    this.Province = this.myForm.get('Province').value.split('|')[1];
    this.Shi()
  }
  // 选择城市
  Shi() {

    let cityA = [];
    for (let j in this.share.diqu['0,' + this.idsheng]) {
      var obj = { name: '', id: '' }
      obj.name = this.share.diqu['0,' + this.idsheng][j];
      obj.id = j;
      cityA.push(obj)
    };
    this.dataShi = cityA;

  }

  CityChange() {
  this.Areas = '';

  this.idshi = this.myForm.get('City').value.split('|')[0];
  this.City = this.myForm.get('City').value.split('|')[1];

  this.Qu()

  }
  //选择地区
  Qu() {
    let quA = [];
    for (let k in this.share.diqu['0,' + this.idsheng + ',' + this.idshi]) {
      var obj = { name: '', id: '' }
      obj.name = this.share.diqu['0,' + this.idsheng + ',' + this.idshi][k];
      obj.id = k;
      quA.push(obj);
    };
    this.dataQu = quA;
  }

  qiehuanmoren(State) {    // 选择是否是默认
		if (State == 1) {
			this.State = 0;
		} else {
			this.State = 1;
		}
		this.myForm.controls['State'].setValue(this.State);
	}
	makesure(event) {    //弹出地址保存提示并提交表单

			if (this.dizhibianji == '添加收货地址') {
				let params;
				let menglong = this.City;
        this.myForm.controls['Province'].setValue(this.Province);
        this.myForm.value.City = menglong;
				params = this.myForm.value;                        //  上传新增地址数据
				this.http.post(this.file.localUrl+'/action/Addresses/PostAddress', params).toPromise().then(response => {
					if (response.json() == true) {
						let alert = this.alerCtrl.create({
							title: '地址保存成功！',
							buttons: [{
								text: '确定',
								handler: () => {
									setTimeout(() => {
										  this.nav.pop()
									}, 500)
								}
							}],
              cssClass: 'fwh',
              enableBackdropDismiss:false
						});
						event.preventDefault();
						alert.present();
					};
					if (response.json() == false) {
						let alert = this.alerCtrl.create({
							title: '地址保存失败！',
							buttons: ['确定'],
              cssClass: 'fwh',
              enableBackdropDismiss:false
						});
						event.preventDefault();
						alert.present();
					}
				});
			} else
				if (this.dizhibianji == '编辑地址') {  // 编辑已有地址
					let params;
          let menglong = this.City;
					this.myForm.controls['UID'].setValue(this.UID);
          this.myForm.controls['Province'].setValue(this.Province);
          this.myForm.value.City = menglong;
					params = this.myForm.value;                        //  上传编辑完的地址数据
					this.http.put(this.file.localUrl+'/action/Addresses/PutAddress/' + this.dizhibainjicanshu.childItem.ID, params).subscribe(response => {
						if (response.json() == true) {
							let alert = this.alerCtrl.create({
								title: '地址保存成功！',
								buttons: [{
									text: '确定',
									handler: () => {
										setTimeout(() => {
											this.nav.pop()
										}, 500)
									}
								}],
                cssClass: 'fwh',
                enableBackdropDismiss:false
							});
							event.preventDefault();
							alert.present();
						};
						if (response.json() == false) {
							let alert = this.alerCtrl.create({
								title: '地址保存失败！',
								buttons: ['确定'],
                cssClass: 'fwh',
                enableBackdropDismiss:false
							});
							event.preventDefault();
							alert.present();
						}
					})
				}
	}
}


