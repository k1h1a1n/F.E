import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { ModalController, NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { ChooseContactsComponent, CreateContactComponent } from '@durity/components';
import { BehaviorSubject } from 'rxjs';
import { ContactServiceService } from 'src/app/shared/services/contact-service.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { DeletePopoverComponent } from 'src/app/shared/components/delete-popover/delete-popover.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EditContactComponent } from 'src/app/shared/components/edit-contact/edit-contact.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.page.html',
    styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
    activeContactGroup  = 'group1';
    buttonDisabled: boolean;
    contactLength: string;
    contactsUploaded: any = [];
    createdContacts: any = [];
    checkedContactEmail: any = [];
    contactsChosen: any = [];
    checkedContactNames: any = [];
    checkedContactNumbers: any = [];
    contacts: any = [];
    editContactDetails: any = [];
    family = 'Family';
    friend =  'Friends';
    index: number;
    mobileContacts: any = [];
    mobilecontacts: {}[];
    other = 'Other';
    relation: string;
    relationship: string;
    selectedContactsArrayOthers: Array<{ firstName: any, mobilePhone: any, primaryEmail: any, relationship: any, user_id: any }> = [];
    selectedContactsArrayFamily: Array<{ firstName: any, mobilePhone: any, primaryEmail: any, relationship: any, user_id: any }> = [];
    selectedContactsArrayFriends: Array<{ firstName: any, mobilePhone: any, primaryEmail: any, relationship: any, user_id: any }> = [];
    userId: string;
    contactData: { firstName: any; mobilePhone: any; relationship: any; };

    constructor (public navService: NavigationService,
                 public modalController: ModalController,
                 public navCtrl: NavController,
                 public toastCtrl: ToastController,
                 public router: Router,
                 public modalCtrl: ModalController,
                 private apiService: ApiService,
                 private contactService: ContactServiceService,
                 public globalVariablesProvider: GlobalVariablesService,
                 private authService: AuthService

    ) {
        // Constructor to be used only for calling methods. Do not include any code.

    }

    ngOnInit () {
        this.authService.currentUser.subscribe(user => this.userId = user._id);

    }

    ionViewWillEnter () {
        this.getContacts();
        this.relation = localStorage.getItem('relation');

        if (this.relation === 'Family') {
            this.activeContactGroup = 'group1' ;

        } else if (this.relation === 'Friends') {
            this.activeContactGroup = 'group2';

        } else if (this.relation === 'Other') {
            this.activeContactGroup = 'group3';

        }

    }

    getContacts () {
      this.apiService.get({name: 'Contacts'}).subscribe(data => {
          this.contacts = data;
          this.contactLength = data.length;
      }, error => {
      });
    }

    selectTab (index) {
        if (index === 1) {
            this.activeContactGroup = 'group' + index;
            const relation =  this.family;
            localStorage.setItem('relationship', relation);

        } else if (index === 2) {
            this.activeContactGroup = 'group' + index;
            const relation =  this.friend;
            localStorage.setItem('relationship', relation);
        } else if (index === 3 ) {
            this.activeContactGroup = 'group' + index;
            const relation =  this.other;
            localStorage.setItem('relationship', relation);
        }
    }

    goto (pageName: any, data?: any) {
        this.navService.goto(pageName, data);
    }

    goBack () {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }


    async selectContact () {
        const toast = await this.toastCtrl.create({
            duration: 3000,
            message: 'It will take 5 - 7 seconds to show the contacts.',
          });
          await toast.present();
      const modal = await this.modalController.create({
          component: ChooseContactsComponent,
          componentProps: {}
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      this.mobileContacts = data;
      this.mobileContacts.selectedContacts.forEach((info) => {
        this.contactsChosen = info;
        if (this.contactsChosen.primaryEmail === null || undefined) {
         this.checkedContactEmail = ' ';
         const contactInfo = this.selectedContacts(this.contactsChosen.selectedContactName, this.contactsChosen.selectedContactNumberOne, this.checkedContactEmail);
         } else {
             this.selectedContacts(this.contactsChosen.selectedContactName, this.contactsChosen.selectedContactNumberOne, this.contactsChosen.primaryEmail.value);
         }

     });
      this.uploadContacts();
 }

  selectedContacts (name = [], mobile = [], email = []) {
      if (this.activeContactGroup === 'group1') {
          this.relationship = 'Family';
          this.selectedContactsArrayFamily.push({ firstName: name, mobilePhone: mobile, primaryEmail: email, relationship: this.relationship, user_id: this.userId });

      } else if (this.activeContactGroup === 'group2') {
          this.relationship = 'Friends';
          this.selectedContactsArrayFriends.push({ firstName: name, mobilePhone: mobile, primaryEmail: email, relationship: this.relationship, user_id: this.userId });

      } else if (this.activeContactGroup === 'group3') {
          this.relationship = 'Other';
          this.selectedContactsArrayOthers.push({ firstName: name, mobilePhone: mobile, primaryEmail: email, relationship: this.relationship, user_id: this.userId });
      }

  }


  uploadContacts () {
      if (this.relationship === 'Family') {
          this.apiService.post('Contacts', { contacts: this.selectedContactsArrayFamily } ).subscribe((data) => {
              this.selectedContactsArrayFamily.length = 0;
              this.getContacts();

          // tslint:disable-next-line:no-unused-expression
          }), (error: any) => {
          };

      } else if (this.relationship === 'Friends') {
        this.apiService.post('Contacts', { contacts: this.selectedContactsArrayFriends }).subscribe((data) => {
              this.selectedContactsArrayFriends.length = 0;
              this.getContacts();
          // tslint:disable-next-line:no-unused-expression
          }), (error: any) => {
          };


      } else if (this.relationship === 'Other') {
        this.apiService.post('Contacts', { contacts: this.selectedContactsArrayOthers }).subscribe((data) => {
              this.contactsUploaded = data;
              this.selectedContactsArrayOthers.length = 0;
              this.getContacts();
          }, (error: any) => {
          });
      }
  }

    // tslint:disable-next-line:adjacent-overload-signatures
    async addContact () {
        const modal = await this.modalCtrl.create({
            component: CreateContactComponent,
            componentProps: {
            }
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        this.createdContacts = data;
        this.contactData = {
             firstName : data.firstName,
             mobilePhone: data.mobilePhone,
             relationship: data.relationship
        };

        if ((data.firstName === '' && data.mobilePhone === '' && data.primaryEmail === '' && data.relationship === '') ) {
        }  else if (data.primaryEmail === '') {
            this.contactService.postContacts(this.contactData).subscribe((info) => {
            this.getContacts();
        }, (error) => {

        });

    } else {

        this.contactService.postContacts(this.createdContacts).subscribe((info) => {
            this.getContacts();
        }, (error) => {
            this.authService.presentToast( error.error.message);


        });

    }
    }


    async editContact (contactId) {
        this.globalVariablesProvider.editContact = true;
        this.contactService.getContactDetailsbyId (contactId)
        .then(async contactInfo => {
            this.editContactDetails = contactInfo;
            const modal = await this.modalCtrl.create({
                component: EditContactComponent,
                componentProps: {contactId: this.editContactDetails._id, contactName: this.editContactDetails.firstName, contactNumber: this.editContactDetails.mobilePhone, contactEmail: this.editContactDetails.primaryEmail, contactRelation: this.editContactDetails.relationship}
            });
            await modal.present();
            this.getContacts ();
        }).catch (error => {

        });

    }

    async  deleteContact (contactid) {
        this.contactService.getBeneficiaryById(contactid)
        .then(async data => {
                const modal = await this.modalCtrl.create({
                component: DeletePopoverComponent,
                cssClass: 'delete-modal',
                componentProps: { deleteType: 'adddedAsBeneficiary', contactId: contactid, fileName: data['fileName']}
                });
                await modal.present();
                const { } = await modal.onWillDismiss();
                this.getContacts ();

        }, async error => {
            const modal = await this.modalCtrl.create({
                component: DeletePopoverComponent,
                cssClass: 'simple-delete-modal',
                componentProps: { deleteType: 'notAddedAsBeneficiary', contactId: contactid, fileName: ''}
                });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            this.getContacts ();

        });
    }

    // for adding more contacts while uploading document from upload document page
    done () {
        this.globalVariablesProvider.addMoreContacts = false;
        this.contactService.getContacts ();
        this.navService.navigateBack ();

    }

    cancel () {
        this.globalVariablesProvider.addMoreContacts = false;
        this.navService.navigateBack ();

    }

}
