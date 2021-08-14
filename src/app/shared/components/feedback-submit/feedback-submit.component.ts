import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-feedback-submit',
  templateUrl: './feedback-submit.component.html',
  styleUrls: ['./feedback-submit.component.scss'],
})
export class FeedbackSubmitComponent implements OnInit {

  constructor(public popOvercntl: PopoverController, public navService: NavigationService) { }

  ngOnInit() {
    setTimeout(() => {
      this.popOvercntl.dismiss();
    }, 1000);
    this.navService.navigateForword('/home');

  }
  }


