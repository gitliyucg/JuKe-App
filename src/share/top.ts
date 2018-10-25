import { Component,Input } from '@angular/core';

@Component({
  selector:'toTop',
  template: `
    <div class="toTop" (tap)="scrollToTop()"></div>
  `
})
export class toTop {
  @Input() viewCon;

  constructor() {
  }
  scrollToTop() {
    this.viewCon.scrollToTop();
  }
}
