import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-will-download-alert',
  templateUrl: './will-download-alert.component.html',
  styleUrls: ['./will-download-alert.component.scss'],
})
export class WillDownloadAlertComponent implements OnInit {

  constructor(private navService: NavigationService,
    private popOverCtrl: PopoverController) { }

  ngOnInit() {}

  goToHomePage(){
    this.navService.navigateRoot('/home');
    this.popOverCtrl.dismiss();
  }

}
