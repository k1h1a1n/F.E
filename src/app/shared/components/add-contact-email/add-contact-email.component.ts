import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ContactServiceService } from '../../services/contact-service.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-add-contact-email',
  templateUrl: './add-contact-email.component.html',
  styleUrls: ['./add-contact-email.component.scss'],
})
export class AddContactEmailComponent implements OnInit {
  addEmailForm: FormGroup;
  contactId: string;
  contactDetails: Array<{firstName: string; mobilePhone: string; primaryEmail: string; relationship: string; user_Id: string}> = [];
  email: string;
  mobile: string;
  name: string;
  relation: string;
  userId: string;
  constructor (
    private authService: AuthService,
    private contactService: ContactServiceService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private navParams: NavParams
    ) {
      this.contactId = this.navParams.get('contactId');
      this.name = this.navParams.get('contactName');
      this.mobile = this.navParams.get('contactNumber');
      this.relation = this.navParams.get('contactRelation');
      this.authService.currentUser.subscribe(user => this.userId = user._id);
  }
  ngOnInit () {
    this.addEmailForm = this.fb.group({
      firstName: this.name,
      mobilePhone: this.mobile,
      primaryEmail: ['', [
          Validators.required,
          Validators.pattern(String.raw`^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`)
      ]],
      relationship: this.relation,
      user_Id: this.userId
  });
}
  submitForm () {
    if (this.addEmailForm.valid) {
    this.contactService.editContact(this.contactId, this.addEmailForm.value).subscribe((data) => {
    });
    this.contactService.getContacts();
    this.modalCtrl.dismiss();
    }
  }
  later () {
    if (this.addEmailForm.invalid) {
      this.modalCtrl.dismiss();
    }
  }

}
