import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContactServiceService } from '../../services/contact-service.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { GetPhonecodesService } from '../../services/get-phonecodes.service';


@Component({
    selector: 'app-create-contact',
    templateUrl: './create-contact.component.html',
    styleUrls: ['./create-contact.component.scss'],
})
export class CreateContactComponent{
    createContactForm: FormGroup;
    userId: string;
    relationship: any;
    relation: any;
    countryCodes: any;
    selectedCountry: any;
    selectedRelation: string;

    constructor (
                 public modalCtrl: ModalController,
                 private fb: FormBuilder,
                 private auth: AuthService,
                 public navParams: NavParams,
                 public phoneCodeService: GetPhonecodesService,
                       ) {
            this.countryCodes = this.phoneCodeService.getCountryCodes();
            this.selectedCountry = this.countryCodes[94];
            this.auth.currentUser.subscribe(user => this.userId = user._id);
            this.createContactForm = this.fb.group({
                firstName: ['', Validators.required],
                mobilePhone: ['',  [Validators.required,  Validators.maxLength(15),
                    Validators.pattern(String.raw`^[0-9]*$`)]],
                primaryEmail: ['', [

                    Validators.pattern(String.raw`^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`)
                ]],
                relationship: ['', Validators.required],
                user_Id: this.userId
            });
         }
ionViewWillEnter () {
    this.selectedRelation = localStorage.getItem('relationship');
}
    goBack () {
        this.modalCtrl.dismiss({
            dismissed: true,
             firstName: '',
             mobilePhone: '',
             primaryEmail: '',
             relationship: ''
    });

}
onChange(event){
    this.selectedCountry = event;

}

    cancel () {
        this.goBack();
    }

     submitForm () {
         if (this.createContactForm.valid) {
        Object.keys(this.createContactForm.controls).forEach((key) =>
        this.createContactForm.get(key).setValue(this.createContactForm.get(key).value.trim()));
        this.modalCtrl.dismiss({
            firstName: this.createContactForm.value.firstName,
            mobilePhone:  this.createContactForm.value.mobilePhone,
            primaryEmail: this.createContactForm.value.primaryEmail,
            relationship: this.createContactForm.value.relationship
        });
    }
}



}



