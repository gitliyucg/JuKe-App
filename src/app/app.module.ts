import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
//我的钱包
import { BalancePage } from "../pages/balance/balance";
import { GuquanfundPage } from "../pages/guquanfund/guquanfund";
import { GuquanPage } from "../pages/guquan/guquan";
/****登录*****/
import { LoginPage } from '../pages/login/login';
import { FindPage } from '../pages/login/find';
import { MobilePage } from '../pages/login/mobile';
import { NewMobilePage } from '../pages/login/newmobile';
/****新闻*****/
import { NewsPage } from '../pages/news/news';
import { NewPage } from '../pages/news/new';
import { XiaoxiPage } from '../pages/news/xiaoxi';


/****会员中心*****/
//我的股权
import { MystockPage } from "../pages/mystock/mystock";
import { MemberPage } from '../pages/member/member';
import { StockdistlistPage } from "../pages/stockdistlist/stockdistlist";
import { StockchangelistPage } from "../pages/stockchangelist/stockchangelist";
import { StockclistPage } from "../pages/stockclist/stockclist";
//会员-收益列表
import { ShouyiPage } from '../pages/shouyi/shouyi';
//会员-支出流水列表
import { LiushuiPage } from '../pages/liushui/liushui';
import { WalletPage } from "../pages/wallet/wallet";

/*****会员-财务中心***/
import { CaiwuPage } from '../pages/caiwu/caiwu';
import { StockPage } from "../pages/stock/stock";
//会员-积分互转
import { JifenPage } from '../pages/caiwu/jifen';
import { JifenlistPage } from '../pages/caiwu/jifenlist';
import { HuzhuanPage } from '../pages/caiwu/huzhuan';
import { HuzhuanlistPage } from '../pages/caiwu/huzhuanlist';

//会员-收益提现
import { TixianPage } from '../pages/caiwu/tixian';
import { TixianlistPage } from '../pages/caiwu/tixianlist';
import { TixianviewPage } from "../pages/caiwu/tixianview";
//会员-报单
import { BaodanPage } from '../pages/caiwu/baodan';
import { BaodanlistPage } from '../pages/caiwu/baodanlist';


/*****会员-设置***/
import { ShezhiPage } from '../pages/shezhi/shezhi';
//会员-安全
import {AnquanPage} from '../pages/shezhi/anquan';
import {UserInfo} from '../pages/shezhi/userinfo';
import {MyhelpPage} from "../pages/shezhi/myhelp";
import {MyFeedPage} from "../pages/shezhi/myfeed";
import {PassPage} from "../pages/shezhi/password";

import {HelplistPage} from "../pages/shezhi/helplist";
import {AboutPage} from "../pages/shezhi/about";
import {XieyiPage} from "../pages/shezhi/xieyi";

/******我的股权******/
import { StocktransPage } from "../pages/stocktrans/stocktrans";
import { StockchangePage } from "../pages/stockchange/stockchange";
import { StockdistPage } from "../pages/stockdist/stockdist";

/*****会员-我的推广***/
import { TuiGuangPage } from '../pages/tuiguang/tuiguang';
//推广-会员注册
import { MemberregPage } from '../pages/tuiguang/memberreg';
//推广-会员列表
import { MemberlistPage } from '../pages/tuiguang/memberlist';
import { JihuoPage } from '../pages/tuiguang/jihuo';
//推广-会员关系导图
import { GuanxiPage } from '../pages/tuiguang/guanxi';
//推广-会员复投
import { FutouPage } from '../pages/tuiguang/futou';
import { FutouListPage } from '../pages/tuiguang/futoulist';
//推广-申请报单中心
import { BaodanSQPage } from '../pages/tuiguang/baodanSQ';
import { BaodanInfoPage } from '../pages/tuiguang/baodaninfo';

//会员-收益明细
import { MondyDetailsPage } from '../pages/MondyDetails/mondyDetails';
//popover分页菜单
import { PopovernumPage} from '../share/pagination/popover';
//popover密码输入
import { PopovercodePage} from '../share/pagination/popovercode';
//公用组件
import { ShareModule } from '../share/share.module';
import { FileService } from '../share/fileService';
import {Camera }  from '@ionic-native/camera';
import { AppUpdate } from '@ionic-native/app-update';
import { AppVersion } from '@ionic-native/app-version';
import { SubSuccess} from '../pages/succ/success';
import { SubSuccessOrder} from '../pages/succ/successOrder';
import { toTop} from '../share/top';

/****首页*****/
import { HomePage } from '../pages/home/home';
import { ListChild } from "../pages/listchild/listchild";
import { IndexnavPage } from '../pages/indexnav/indexnav';
import { PopoverPage } from '../pages/intocarts/intocarts';
import { ShoppingCart } from '../pages/shoppingcart/shoppingcart';
import { YiXuan } from '../pages/shoppingcart/yixuan';
import { QueRen } from '../pages/querendingdan/querendingdan';
import { addShouHuo } from '../pages/addShouHuo/addShouHuo';
import { DiZhiGuanLi } from '../pages/dizhiguanli/dizhiguanli';
import { MyOrders } from '../pages/myorders/myorders';
import { OrderInfoPage } from '../pages/myorders/orderinfo';
import { FenXiang } from '../pages/fenxiang/fenxiang';
import { ClosePage} from '../pages/login/webClose';
import { orderTui} from '../pages/myorders/ordertui';
import { orderState} from '../pages/myorders/orderstate';
import { orderWuliu} from '../pages/myorders/wuliu';
import { MyOrderstui} from '../pages/myorders/myorderstui';
import { RechargesPage } from "../pages/recharges/recharges";
import { DynamicPage } from "../pages/dynamic/dynamic";
import { ConsumptionPage } from "../pages/consumption/consumption";
import { ChargelistPage } from "../pages/chargelist/chargelist";
import { RecharageslistPage } from "../pages/recharageslist/recharageslist";
import { ChargePage } from "../pages/charge/charge";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@NgModule({
  declarations: [
    MyApp,
    ClosePage,
    NewsPage,NewPage,XiaoxiPage,
    MemberPage,
    orderTui,
    orderState,
    MyOrderstui,
    //登录
    LoginPage,FindPage,MobilePage,NewMobilePage,
    //收益
    ShouyiPage,MondyDetailsPage,PopovernumPage,
    LiushuiPage,
    //我的股权
    StocktransPage,
    StockchangePage,
    StockdistPage,
    StockdistlistPage,
    StockchangelistPage,
    StockclistPage,
    //财务
    MystockPage,
    GuquanfundPage,
    GuquanPage,
    BalancePage,
    StockPage,
    JifenlistPage,JifenPage,PopovercodePage,CaiwuPage,TixianPage,TixianlistPage,BaodanPage,BaodanlistPage,HuzhuanPage,HuzhuanlistPage,TixianviewPage,
    //设置
    ShezhiPage,AnquanPage,UserInfo,HelplistPage,MyhelpPage,MyFeedPage,PassPage,AboutPage,XieyiPage,
    //推广
    TuiGuangPage,MemberregPage,MemberlistPage,GuanxiPage,FutouPage,FutouListPage,JihuoPage,BaodanSQPage,BaodanInfoPage,
    HomePage, ListChild,FenXiang,
    IndexnavPage,SubSuccess,
    PopoverPage,
    ShoppingCart,
    YiXuan,
    QueRen,
    addShouHuo,
    DiZhiGuanLi,
    //订单
    MyOrders,OrderInfoPage,SubSuccessOrder,orderWuliu,
    toTop,
    RechargesPage,
    DynamicPage,
    ConsumptionPage,
    ChargePage,
    RecharageslistPage,
    ChargelistPage,
    WalletPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ShareModule,
    IonicModule.forRoot(MyApp,{
      backButtonText: '',
      iconMode: 'ios',
      mode: 'ios'
    }),
    IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ClosePage,
    NewsPage,NewPage,XiaoxiPage,
    MemberPage,
    orderTui,
    orderState,
    MyOrderstui,
    //登录
    LoginPage,FindPage,MobilePage,NewMobilePage,
    //收益
    ShouyiPage,MondyDetailsPage,PopovernumPage,
    LiushuiPage,
    //我的股权
    StocktransPage,
    StockchangePage,
    StockdistPage,
    StockdistlistPage,
    StockchangelistPage,
    StockclistPage,
    //财务
    MystockPage,
    GuquanfundPage,
    GuquanPage,
    BalancePage,
    StockPage,
    JifenlistPage,JifenPage,PopovercodePage,CaiwuPage,TixianPage,TixianlistPage,BaodanPage,BaodanlistPage,HuzhuanPage,HuzhuanlistPage,TixianviewPage,
    //设置
    ShezhiPage,AnquanPage,UserInfo,HelplistPage,MyhelpPage,MyFeedPage,PassPage,AboutPage,XieyiPage,
    //推广
    TuiGuangPage,MemberregPage,MemberlistPage,GuanxiPage,FutouPage,FutouListPage,JihuoPage,BaodanSQPage,BaodanInfoPage,
    HomePage, ListChild,FenXiang,
    IndexnavPage,SubSuccess,
    PopoverPage,
    ShoppingCart,
    YiXuan,
    QueRen,
    addShouHuo,
    DiZhiGuanLi,
    //订单
    MyOrders,OrderInfoPage,SubSuccessOrder,orderWuliu,
    toTop,
    RechargesPage,
    DynamicPage,
    ConsumptionPage,
    ChargePage,
    ChargelistPage,
    RecharageslistPage,
    WalletPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileService,
    Camera,
    AppUpdate,
    AppVersion,
    ChargePage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
