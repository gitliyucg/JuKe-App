import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'page-pagination',
  template: `
        <ion-grid text-center>
        <ion-row>
          <ion-col><button  [disabled]="pageNum==1" (click)="btnClick(pageNum-1)">上一页</button></ion-col>
          <ion-col><input type="number" class="" [(ngModel)]="pageNum" (blur)="toPage(pageNum)" [disabled]="pagenums.length<2"/></ion-col>
          <!--ion-col><button (click)="presentPopover($event)" >第{{pageNum}}页</button><span></span></ion-col-->
          <ion-col col-2>共{{pagenums.length}}页</ion-col>
          <ion-col><button  [disabled]="pagenums.length<2||pageNum==pagenums.length"  (click)="btnClick(pageNum+1)">下一页</button></ion-col>
        </ion-row>
        </ion-grid>
  `
})
export class PaginationPage {
  @Input()
  pagenums = [];//共多少条数据

  @Output()
  search = new EventEmitter<number>();//点击按钮事件

  pageNum: number = 1;//当前第几页,默认1

  constructor() {

  }

  btnClick(pageNum) {

    this.pageNum = pageNum;
    this.search.emit(pageNum);

  }
toPage(pageNum){
    if(pageNum){
      if(pageNum>this.pagenums.length){
        this.pageNum = this.pagenums.length;
        this.search.emit(this.pagenums.length);
      }else if(pageNum<=0){
        this.pageNum = this.pagenums.length;
        this.search.emit(this.pagenums.length);
      }else{
        this.search.emit(pageNum);
      }

    }


}
  /*presentPopover(myEvent) {
    let item = this.pagenums;
    let popover = this.popoverCtrl.create(PopovernumPage, {
      item,
      cb: this.btnClick.bind(this)  //绑定组件this
    });
    popover.present({
      ev: myEvent
    });
  }*/

}
