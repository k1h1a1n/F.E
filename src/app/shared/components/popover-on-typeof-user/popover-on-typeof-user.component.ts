import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-on-typeof-user',
  templateUrl: './popover-on-typeof-user.component.html',
  styleUrls: ['./popover-on-typeof-user.component.scss'],
})
export class PopoverOnTypeofUserComponent implements OnInit {

  constructor(
    public popOverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  remove(){
    this.popOverCtrl.dismiss();

  }

}
