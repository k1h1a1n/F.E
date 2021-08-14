import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-encryption-popover',
  templateUrl: './encryption-popover.component.html',
  styleUrls: ['./encryption-popover.component.scss'],
})
export class EncryptionPopoverComponent  {

  constructor (public popOverCtrl: PopoverController) { }
@Input() isDisplay: boolean;
@Output() someEvent = new EventEmitter();
  // close () {
  //   console.log(this.isDisplay)
  //   //this.popOverCtrl.dismiss();
  //   if(this.isDisplay == false ) {
  //     this.isDisplay = true
  //   }else if(this.isDisplay == true) {
  //     this.isDisplay = false
  //   }
  // }

}
