import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavigationService } from '@durity/services';

@Component({
    selector: 'app-disclaimer',
    templateUrl: './disclaimer.component.html',
    styleUrls: ['./disclaimer.component.scss'],
})
export class DisclaimerComponent  {

    constructor (public modalCtrl: ModalController,
                 private navService: NavigationService) { }

    next () {
        this.navService.navigateRoot('/share-details');
    }
}
