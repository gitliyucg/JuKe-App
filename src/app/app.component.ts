import { Component,ViewChild } from '@angular/core';
import {AlertController, App, NavController, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//安卓升级插件
// import { AppUpdate } from '@ionic-native/app-update';
import { IndexnavPage } from '../pages/indexnav/indexnav';
import { AppVersion } from '@ionic-native/app-version';
import {Http} from "@angular/http";
import { Storage } from '@ionic/storage';
import {ClosePage} from "../pages/login/webClose";
import {LoginPage} from "../pages/login/login";
import {FileService} from "../share/fileService";
import '../share/sse'
declare let cordova:any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('rootNavController') navCtrl:NavController;
  rootPage:any = IndexnavPage;
  isweb:boolean = true;
  goback:boolean = false;
  toUpdate = 'http://17110938399.share.sj.360.cn/qcms/view/t/detail?id=3875250';
  constructor(
    alertCtrl:AlertController,
    private platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    // appUpdate: AppUpdate,
    appVersion:AppVersion,
    public storage: Storage,
    http:Http,
    app:App,
    private toastCtrl:ToastController,
    private fileService:FileService) {
    // const updateUrl = 'http://image.hxig.cn/update.xml';

    var source = new EventSource(this.fileService.localUrl+"/action/music/Weihu");
    let thiscloseKey = '0';
    source.onmessage = function (data) {
      if(thiscloseKey !=data.data)
      {
        if (data.data === '1') {
          thiscloseKey = '1';
          this.isweb = false;
          app.getRootNav().push(ClosePage);
        } else {
          thiscloseKey = '0';
          this.isweb = true;
          app.getRootNav().push(MyApp);
        }
      }
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // statusBar.show();
      // document.addEventListener( 'resume', () => {
      //   statusBar.show();
      // } )
      // splashScreen.hide();
      storage.get('userStorage').then(value => {
          if (value===null||value==='undefined'||value==='') {
            app.getRootNav().push(LoginPage);
          }
      })
      if (platform.is("ios")) {
        // statusBar.hide();
        statusBar.overlaysWebView(true);
        http.get('http://itunes.apple.com/lookup?id=1259120679').subscribe(response => {
          let mydata = response.json();
          if(mydata.resultCount>0) {
            let ver = mydata.results[0].version.replace(/\./g,'');
            ver = parseInt(ver)
            appVersion.getVersionCode().then(value => {
              let thisv = value.replace(/\./g,'');
              thisv = parseInt(thisv);
              if(thisv<ver){
                alertCtrl.create({
                  title: '提示',
                  subTitle: '有新版本，请前往更新',
                  buttons: [{
                    text: '确定',
                    handler: () => {
                      window.open(mydata.results[0].trackViewUrl)
                      platform.exitApp();
                    }
                  }],
                  cssClass: 'fwh',
                  enableBackdropDismiss:false
                }).present();
                return false;
              }
            })
          }
        })

        }

      if (platform.is("android")) {
          // statusBar.overlaysWebView(false);
          http.get(this.fileService.localUrl + '/action/Versions/GetNewest').subscribe(response => {
              let mydata = response.json();
              let ver = mydata.Version;
              ver = parseInt(ver);
              appVersion.getVersionCode().then(value => {
                  let thisv = parseInt(value);
                  // alert(ver);
                  // alert(thisv)
                  if(thisv<ver){
                      alertCtrl.create({
                        title: '提示',
                        subTitle: '有新版本，请前往更新',
                        buttons: [{
                          text: '确定',
                          handler: () => {
                            cordova.InAppBrowser.open(this.toUpdate, '_system');
                            alertCtrl.create({
                              title: '提示',
                              subTitle: '请等待更新完成',
                              cssClass: 'fwh',
                              enableBackdropDismiss:false
                            }).present();
                          }
                        }],
                        cssClass: 'fwh',
                        enableBackdropDismiss:false
                      }).present();
                      // appUpdate.checkAppUpdate(updateUrl);
                  }
              })
          })
          platform.registerBackButtonAction(() => {
              if(!this.isweb){
                  return false;
              }else {
                  storage.get('userStorage').then(value => {
                      if (value === null || value === 'undefined' || value === '') {
                          return false;
                      } else {
                          let activeVC = this.navCtrl.getActive();
                          let page = activeVC.instance;
                          if (!(page instanceof IndexnavPage)) {
                              if (!this.navCtrl.canGoBack()) {
                                  //当前页面为tabs，退出APP
                                  return this.showExit();
                              }
                              //当前页面为tabs的子页面，正常返回
                              return this.navCtrl.pop();
                          }
                          let tabs = page.tabRef;
                          let activeNav = tabs.getSelected();
                          if (!activeNav.canGoBack()) {
                              //当前页面为tab栏，退出APP
                              return this.showExit();
                          }
                          //当前页面为tab栏的子页面，正常返回
                          return activeNav.pop();
                      }
                  })

              }
          }, 101);


      }

    });
  }
  showExit() {
    if (this.goback) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
        this.toastCtrl.create({
          message: '再按一次退出应用',
          duration: 2000,
          position: 'top'
        }).present();
        this.goback = true;
        setTimeout(() => this.goback = false, 2000);//2秒内没有再次点击返回则将触发标志标记为false
    }
  }
}

