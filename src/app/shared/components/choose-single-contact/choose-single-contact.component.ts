import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { ApiService } from './../../../services/api.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Contacts } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-choose-single-contact',
  templateUrl: './choose-single-contact.component.html',
  styleUrls: ['./choose-single-contact.component.scss'],
})
export class ChooseSingleContactComponent implements OnInit {

  constructor (
    public navService: NavigationService,
    public modalCtrl: ModalController,
    private contacts: Contacts,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public apiService: ApiService
  ) {
    this.search('');
    this.loadContacts();
    this.chooseContactForm = this.fb.group({
      cont: [null]
    });
  }
  public allContacts: any = [];
  chooseContactForm: FormGroup;
  checked = false;
  contactsfound = [];
  contactsArray: Array<{ contactName: string; contactNumberOne: string }> = [];
  selectedContactNumber: any = [];
  keys: string[];
  selectedContactsArray: Array<{
    selectedContactName: string;
    selectedContactNumberOne: string;
    primaryEmail: string;
  }> = [];
  unselectedContactsArray: Array<{
    unselectedContactName: string;
    unselectedContactNumberOne: string;
    unselectedEmail: string;
  }> = [];
  selectedContactName: string;
  unselectedContactName: string;
  unselectedContactNumber: any = [];
  myContacts: any[];
  primaryEmail: any;
  unselectedEmail: string;
  myContactsBackup: any[];
  cts: any;
  newSelectedContacts = [];

  ngOnInit () {
    this.apiService.get({name: 'Contacts'}).subscribe(data => {

      for (data of data) {
        const contactListData = data.mobilePhone[0].replace(/\s/g, '');
        const relationShip = data.relationship;
        console.log(data, relationShip);
      }
      // for (let j = 0; j < this.myContacts.length; j++) {
      //   for (let i = 0; i < this.myContacts[j].phoneNumbers.length; i++) {
      //     const number = this.myContacts[j].phoneNumbers[i].value.replace(/\s/g, '');
      //     if (number.length === 10 || number.slice(0, 3) === '+91') {

      //     }
      //   }
      //   this.myContacts = this.myContacts;
      // }
    });
  }

  goto (pageName, data?) {
    this.navService.goto(pageName, data);
  }
  goBack(){
    this.navService.navigateBack();
  }

  
  async loadContacts () {
    const options = {
      filter: '',
      multiple: true,
      hasPhoneNumber: true,
    };
    const loader = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    (await loader).present();
    this.contacts.find(['*'], options).then(
      (contacts: any) => {
        loader.dismiss();

        this.myContacts = contacts.map((elem) => ({
          addresses: elem._objectInstance.addresses,
          birthday: elem._objectInstance.birthday,
          categories: elem._objectInstance.categories,
          displayName: elem._objectInstance.displayName,
          emails: elem._objectInstance.emails,
          id: elem._objectInstance.id,
          ims: elem._objectInstance.ims,
          name: elem._objectInstance.name,
          nickname: elem._objectInstance.nickname,
          note: elem._objectInstance.note,
          organizations: elem._objectInstance.organizations,
          phoneNumbers: elem._objectInstance.phoneNumbers,
          photos: elem._objectInstance.photos,
          rawId: elem._objectInstance.rawId,
          urls: elem._objectInstance.urls,
          checked: "false",
          disable: false,
        }));

        for (let j = 0; j < this.myContacts.length; j++) {
          for (let i = 0; i < this.myContacts[j].phoneNumbers.length; i++) {
            const number = this.myContacts[j].phoneNumbers[i].value.replace(/\s/g, '');
            if (number.length === 10 || number.slice(0, 3) === '+91') {
              // this.myContacts[j].disable = true;
              // this.myContacts[j].checked = true;
              // console.log(this.myContacts[j].checked, this.myContacts[j]);
            }
          }
          this.myContacts = this.myContacts;
        }
        this.myContacts.sort(this.GetSortOrder('displayName'));
        this.myContactsBackup = this.myContacts;
        // alert('We are currently not allowing other than India contacts. ');
      },
      (error) => {
        loader.dismiss();
        this.modalCtrl.dismiss();
      }
    );
  }

  alertDismissed () {
    let newVar: any;
    newVar = window.navigator;
    newVar.notification.alert(
      'Document couldnt be uploaded.', // the message
      function () {}, // a callback
      'Access Denied', // a title
      'OK' // the button text
    );
  }

  GetSortOrder (prop) {
    return function (a, b) {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }

  async search (q) {
    this.myContacts = this.myContactsBackup;
    this.myContacts = this.myContacts.filter((contact) => {
      if (!!contact.displayName && typeof contact.displayName === 'string') {
        return contact.displayName.toLowerCase().indexOf(q.toLowerCase()) > -1;
      }
    });
  }

  onKeyUp (ev) {
    this.search(ev.target.value);
  }
  
  async getContact (
    contactName: string,
    contactNumber,
    email: string,
    isChecked: boolean) {
      console.log(typeof isChecked);
      const number = contactNumber.replace(/\s/g, '');
      if (number.length === 10 || number.slice(0, 3) === '+91' ) {
        isChecked = true;
        this.getChecked(contactName,
                        contactNumber,
                        email,
                        isChecked);
    } else {
      if (isChecked === false) {
        alert('We are currently not allowing other than India contacts. ');
      }
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < this.myContacts.length; j++) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.myContacts[j].phoneNumbers.length; i++) {
          const num = this.myContacts[j].phoneNumbers[i].value.replace(/\s/g, '');
          if ( num === number) {
            console.log( typeof this.myContacts[j].checked, this.myContacts[j].checked);
            this.myContacts[j].checked = false;
            this.myContacts[j].disable = true;
            break;
          }
        }
    }


  }

  }
  getChecked ( contactName: string,
               contactNumber,
               email: string,
               isChecked: boolean) {
      if (isChecked === true) {
        this.selectedContactName = contactName;
        this.selectedContactNumber = contactNumber;
        this.primaryEmail = email;
        const selected = this.selectedMobileContacts(
          this.selectedContactName,
          this.selectedContactNumber,
          this.primaryEmail
        );
      } else {
      if (isChecked === false) {
        this.unselectedContactName = contactName;
        this.unselectedContactNumber = contactNumber;
        this.unselectedEmail = email;
        const unselected = this.unselectedMobileContacts(
          this.unselectedContactName,
          this.unselectedContactNumber,
          this.unselectedEmail
        );
      }
        }
      this.gotoContacts();

}

  
  gotoContacts () {
    this.contactsList();
    this.modalCtrl.dismiss({
      selectedContacts: this.selectedContactsArray,
    });
  }

  selectedMobileContacts (name: string, mobile: string, email: string) {
    this.selectedContactsArray.push({
      selectedContactName: name,
      selectedContactNumberOne: mobile,
      primaryEmail: email,
    });
    // tslint:disable-next-line:prefer-for-of
  }

  unselectedMobileContacts (name: string, mobile: string, email: string) {
    this.unselectedContactsArray.push({
      unselectedContactName: name,
      unselectedContactNumberOne: mobile,
      unselectedEmail: email,
    });
  }

  contactsList () {

    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < this.unselectedContactsArray.length; j++) {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.selectedContactsArray.length; i++) {
        if (
          this.selectedContactsArray[i].selectedContactName ===
            this.unselectedContactsArray[j].unselectedContactName &&
          this.selectedContactsArray[i].selectedContactNumberOne ===
            this.unselectedContactsArray[j].unselectedContactNumberOne
        ) {
          this.selectedContactsArray.splice(i, 1);
        }
      }
    }
  }

  addedContacts (name: any, mobile: any) {
    this.contactsArray.push({ contactName: name, contactNumberOne: mobile });
  }

}

