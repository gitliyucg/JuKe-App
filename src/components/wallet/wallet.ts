import { Component } from '@angular/core';

/**
 * Generated class for the WalletComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'wallet',
  templateUrl: 'wallet.html'
})
export class WalletComponent {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }

}
