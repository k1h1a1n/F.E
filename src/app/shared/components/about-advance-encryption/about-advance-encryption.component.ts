import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-about-advance-encryption',
  templateUrl: './about-advance-encryption.component.html',
  styleUrls: ['./about-advance-encryption.component.scss'],
})
export class AboutAdvanceEncryptionComponent implements OnInit {

  constructor(    public popOverCtrl: PopoverController,
    ) { }

  ngOnInit() {}

  closePopOver() {
    
    this.popOverCtrl.dismiss();
  }

}
