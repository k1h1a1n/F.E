import { ModalController } from '@ionic/angular';
import { NavigationService } from './../../services/navigation.service';
// import { NavigationService } from '../../../shared/services/navigation.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-claim-modal',
  templateUrl: './claim-modal.component.html',
  styleUrls: ['./claim-modal.component.scss'],
})
export class ClaimModalComponent implements OnInit {

  constructor(public navService: NavigationService, public modalCtrl: ModalController) { }

  ngOnInit() {}

  goBack() {
    this.navService.navigateBack();
  }
  onDone() {
    this.modalCtrl.dismiss({
    // this.navService.navigateForword('/home');
      
    });
  }
}
