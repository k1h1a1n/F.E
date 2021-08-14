import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PopoverController, ModalController } from '@ionic/angular';
import { FeedbackSubmitComponent } from '../feedback-submit/feedback-submit.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {

  feedbackForm: FormGroup;


  constructor (private fb: FormBuilder, public modalCtrl: ModalController, public popoverController: PopoverController) {
    this.feedbackForm = this.fb.group({
      Title: ['', Validators.required],
      Email1: ['', Validators.required],
      Description: ['', ]

    });
  }

  async submitFeedback () {
    const modal = await this.modalCtrl.create({
      component: ToastComponent,
      cssClass: 'simple-delete-modal',
      componentProps: { feedbackMessage: 'feedbackMessage' }
    });
    await modal.present();
  }

  ngOnInit () {}
}
