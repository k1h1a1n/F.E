import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { async } from 'rxjs/internal/scheduler/async';
import { ToastComponent } from '../toast/toast.component';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {

  contactUsForm: FormGroup;
  constructor(private navService: NavigationService ,
              private fb: FormBuilder,
              public modalCtrl: ModalController,
              private apiService: ApiService ) { 
    this.contactUsForm = this.fb.group({
      emailId: ['', Validators.required],
      subject: ['', Validators.required],
      Description: ['', ]
    });
  } 
  async submitForm () {
    //send mail
    var mailContents={
        email: this.contactUsForm.value.emailId,
        subject: this.contactUsForm.value.subject,
        description: this.contactUsForm.value.Description
    }
    this.apiService.post(`user/sendMailToHelpCenter`, { mailContents: mailContents } ).subscribe((data) => {
      //this.selectedContactsArrayFamily.length = 0;

  }), (error: any) => {
  };
    const modal = await this.modalCtrl.create({
      component: ToastComponent,
      cssClass: 'simple-delete-modal',
      backdropDismiss: true,
      componentProps: { contactUsMessage: 'contactUsMessage' }
    });
    await modal.present();
    //this.navService.navigateForword('/home');
  }
  ngOnInit() {}
  goto (pageName: any) {
    this.navService.navigateForword(pageName.url);
  }
  goBack () {
  this.navService.navigateBack ();
  }
}
