import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavigationService } from '@durity/services';

@Component({
  selector: 'app-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss'],
})
export class TemplatePage {
  constructor (public popOverCtrl: PopoverController, private navService: NavigationService) { }

  confirm () {
    this.popOverCtrl.dismiss();
    this.navService.navigateForword(['/reset-password']);

  }
  goBack () {
    this.popOverCtrl.dismiss();
  }
}
