import { Component, Input, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ContactServiceService } from '../../services/contact-service.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {
  @Input () contactId;
  @Input () contactName;
  @Input () contactNumber;
  @Input () contactEmail;
  @Input () contactRelation;

 editContactForm: FormGroup;
  userId: string;
  phNumber: string;
  contactData: { firstName: any; mobilePhone: any; relationship: any; };

  constructor (
               public modalCtrl: ModalController,
               private fb: FormBuilder,
               private auth: AuthService,
               private contactService: ContactServiceService,
      ) {
        this.auth.currentUser.subscribe(user => this.userId = user._id);
        this.editContactForm = this.fb.group({
              firstName: ['', Validators.required],
              mobilePhone: ['',  [Validators.required, Validators.maxLength(15),
                Validators.pattern(String.raw`^([+0-9 ]+\s*)+$`)
                ]],
              primaryEmail: ['', [
                  Validators.pattern(String.raw`^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`)
              ]],
              relationship: ['', Validators.required],
              user_Id: this.userId
          });
       }

  ngOnInit () {
    this.contactEmail = this.contactEmail.trim('');
  }

  goBack () {
      this.modalCtrl.dismiss({
          dismissed: true
      });
  }

  cancel () {
      this.goBack();
  }

   submitForm () {
       if (this.editContactForm.valid) {
        this.contactData = {
          firstName : this.editContactForm.value.firstName,
             mobilePhone: this.editContactForm.value.mobilePhone,
             relationship: this.editContactForm.value.relationship
        };
        if (this.editContactForm.value.primaryEmail === '') {
          this.contactService.editContact(this.contactId, this.contactData).subscribe((data) => {
            this.contactService.getContacts ();
          } , (error) => {
          } );
          this.modalCtrl.dismiss({
              firstName: this.editContactForm.value.firstName,
              mobilePhone: this.editContactForm.value.mobilePhone,
              // primaryEmail: this.editContactForm.value.primaryEmail,
              relationship: this.editContactForm.value.relationship
          });
      } else {
        this.contactService.editContact(this.contactId, this.editContactForm.value).subscribe((data) => {
        this.contactService.getContacts ();

      } , (error) => {
      } );
        this.modalCtrl.dismiss({
          firstName: this.editContactForm.value.firstName,
          mobilePhone: this.editContactForm.value.mobilePhone,
          primaryEmail: this.editContactForm.value.primaryEmail,
          relationship: this.editContactForm.value.relationship
      });
  }
}
   }
}
