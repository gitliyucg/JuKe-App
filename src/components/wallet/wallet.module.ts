import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletComponent } from './wallet';

@NgModule({
  declarations: [
    WalletComponent,
  ],
  imports: [
    IonicPageModule.forChild(WalletComponent),
  ],
  exports: [
    WalletComponent
  ]
})
export class WalletComponentModule {}
