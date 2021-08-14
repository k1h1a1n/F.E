import { Component, Input, OnInit} from '@angular/core';
import { PopoverController, ModalController} from '@ionic/angular';
import { NavigationService } from '@durity/services';
import {UpgradePlanComponent} from '../upgrade-plan/upgrade-plan.component'
@Component({
  selector: 'app-upgrade-popover',
  templateUrl: './upgrade-popover.component.html',
  styleUrls: ['./upgrade-popover.component.scss'],
})
export class UpgradePopoverComponent implements OnInit {

  constructor(private popover: PopoverController,
              private navService: NavigationService,
              public modalCtrl: ModalController) { }

  ngOnInit() {}
   async onOK(){
    const modal = await this.modalCtrl.create({
      component: UpgradePlanComponent,
      componentProps: {value: true}
  });
    await modal.present();
    //this.navService.navigateRoot('/upgrade-plan');
    this.popover.dismiss();
  }
  onCancel(){
    this.popover.dismiss();
  }

}
