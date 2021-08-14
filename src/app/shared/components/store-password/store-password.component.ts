import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavigationService } from '@durity/services';

@Component({
  selector: 'app-store-password',
  templateUrl: './store-password.component.html',
  styleUrls: ['./store-password.component.scss'],
})
export class StorePasswordComponent implements OnInit {
  shownGroup = null;
  constructor (public popOverCtrl: PopoverController, private navService: NavigationService) {

  }
 async popOver () {
  const popover = await this.popOverCtrl.create({
    component: StorePasswordComponent,
    cssClass: 'custom-popOverCtrl',
    translucent: true
  });
  return await popover.present();
  }
  no () {
  this.navService.navigateRoot('/disclaimer');
  }
  yes () {
    this.navService.navigateRoot('/disclaimer');
  }

  ngOnInit () { }
  toggleGroup (group) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
    } else {
      this.shownGroup = group;
    }
  }
  isGroupShown (group) {
    return this.shownGroup === group;
  }
}
