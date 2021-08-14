import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { LoadingController, ModalController, NavController, ToastController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChooseContactsComponent, CreateContactComponent } from '@durity/components'
import { ApiService } from 'src/app/services/api.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContactServiceService } from 'src/app/shared/services/contact-service.service';
import { DeletePopoverComponent } from '../../delete-popover/delete-popover.component';
import { EditContactComponent } from '../../edit-contact/edit-contact.component';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.scss'],
})

export class AddContactsComponent implements OnInit {
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
    contactData: { firstName: any; mobilePhone: any; relationship: any; };
    relationship: string;
    selectedContactsArrayOthers: Array<{ firstName: any, mobilePhone: any, primaryEmail: any, relationship: any, user_id: any }> = [];
    selectedContactsArrayFamily: Array<{ firstName: any, mobilePhone: any, primaryEmail: any, relationship: any, user_id: any }> = [];
    selectedContactsArrayFriends: Array<{ firstName: any, mobilePhone: any, primaryEmail: any, relationship: any, user_id: any }> = [];
    token: string;
    userId: string;
    willQes = ['Top 5 misconceptions of creating a Will.', "I'm only in my 40's, do I need to create a Will?", "What happens if I don't have a Will?"];
    public upload = false;

    constructor (public navService: NavigationService,
                 public modalController: ModalController,
                 public navCtrl: NavController,
                 public toastCtrl: ToastController,
                 public router: Router,
                 public modalCtrl: ModalController,
                 private apiService: ApiService,
                 private contactService: ContactServiceService,
                 private globalVariablesProvider: GlobalVariablesService,
                 public popoverController: PopoverController,
                 private authService: AuthService,
                 public loaderCtrl: LoadingController,
                 private storage: Storage,
                 private http: HttpClient
    ) {
        // Constructor to be used only for calling methods. Do not include any code.
        this.loaderCtrl.dismiss();

    }

    ngOnInit () {

        this.token = this.globalVariablesProvider.token;
        this.authService.currentUser.subscribe(user => this.userId = user._id);

    }
    ionViewWillEnter () {
        this.loaderCtrl.dismiss();
        this.getContacts();
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

    async addContact () {
        const modal = await this.modalController.create({
            component: CreateContactComponent,
            componentProps: {
            }

        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        this.createdContacts = data;
        this.contactData = {
            firstName: data.firstName,
            mobilePhone: data.mobilePhone,
            relationship: data.relationship
        };
        if (data.firstName === '' && data.mobilePhone === '' && data.primaryEmail === '' && data.relationship === '') {
            } else {
                this.contactService.postContacts(this.contactData).subscribe((info) => {
                this.getContacts();
            }, (error) => {
            });
    }
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

    skip () {
        this.navService.navigateForword('/home');
        // this.modalCtrl.dismiss();
    }

    async  deleteContact (contactid) {
        const modal = await this.modalCtrl.create({
                component: DeletePopoverComponent,
                cssClass: 'delete-modal',
                componentProps: { deleteType: 'notAddedAsBeneficiary', contactId: contactid, fileName: ''}
                });
        this.getContacts ();
        await modal.present();
        const { } = await modal.onWillDismiss();
        this.getContacts();

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
        }, async error => {
        });

    }

    next () {
          this.navService.navigateForword('/encrypt-details');
    }
    howItWorks() {
        window.open('https://www.youtube.com/watch?v=ou26p2aS0W0&t=10s', '_system');
    }
    whyDurity() {
        window.open('https://www.youtube.com/watch?v=b87W-KZXL-I', '_system');
    }
    getStarted () {
        // this.navService.navigateForword('/security');
        this.upload = false;
        this.globalVariablesProvider.encryptFile = true;
        // this.navService.navigateForword('/select-doc');
        localStorage.setItem('Upload', JSON.stringify(this.upload));
        // this.apiService.post('user/userEncryptionStatus', {userEncryption: {isEnabled: true, algorithm: 'AES-256'}}).subscribe((data) => {
        //   this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
        //     this.auth.setAuth(res);
        // });
        // });
        this.apiService.post('user/signupProcessStatus', {signupProcessCompleted: true}).subscribe((data) => {
          this.navService.navigateForword('/home');
        });
        // this.navService.navigateForword('/select-doc');
    
      }

      isaboutEncription = false
  async aboutEncryption () {
    if(this.isaboutEncription == false) {
      this.isaboutEncription = true
    }else if(this.isaboutEncription == true) {
      this.isaboutEncription = false
    }
    // const popover = await this.popoverController.create({
    //   component: EncryptionPopoverComponent,
    //   translucent: true,
    //   backdropDismiss: false,
    //   cssClass: 'custom-popoverEncryption'
    // });
    // return await popover.present();

  }

  isUploadInfo = true;
uploadCardIcon = '../../../../../assets/imgs/Upward.png';
isuploadDoc = true;
isuploadDocArrow = "../../../../../assets/imgs/Downward.png";
isAssignBeneficiary = true;
isAssignBinaryArrow = "../../../../../assets/imgs/Downward.png";
isWillInfo = true;
isWillArrow = "../../../../../assets/imgs/Downward.png";
isLockInfo = false;
isLockArrow = '../../../../../assets/imgs/Downward.png';

uploadInfo() {
    console.log('upload info : ',this.isUploadInfo)
    if(this.isUploadInfo == false) {
      this.isUploadInfo = true
      this.uploadCardIcon ='../../../../../assets/imgs/Upward.png'
      this.isWillInfo = false
      this.isWillArrow = "../../../../../assets/imgs/Downward.png"
      this.isLockInfo = false
      this.isLockArrow = "../../../../../assets/imgs/Downward.png"
    } else if(this.isUploadInfo == true) {
      this.isUploadInfo = false
      this.uploadCardIcon = '../../../../../assets/imgs/Downward.png';
      this.isWillInfo = false
      this.isWillArrow = "../../../../../assets/imgs/Downward.png"
      this.isLockInfo = false
      this.isLockArrow = "../../../../../assets/imgs/Downward.png"
     
    }
   
  }
  
  uploadDoc() {
    if(this.isuploadDoc == false) {
      this.isuploadDoc = true;
      this.isuploadDocArrow = "../../../../../assets/imgs/Upward.png"
    } else if(this.isuploadDoc == true) {
      this.isuploadDoc = false
      this.isuploadDocArrow = "../../../../../assets/imgs/Downward.png"
    }

  }
  
  assignBeneficiary() {
    if(this.isAssignBeneficiary == false ) {
      this.isAssignBeneficiary = true
      this.isAssignBinaryArrow = "../../../../../assets/imgs/Upward.png"
    } else if(this.isAssignBeneficiary == true) {
      this.isAssignBeneficiary = false
      this.isAssignBinaryArrow = "../../../../../assets/imgs/Downward.png"
    }
  }
  
  LockInfo(){
    console.log('LockInfo info : ',this.isLockInfo)

    if(this.isLockInfo == false){
      this.isLockInfo = true
      this.isLockArrow = "../../../../../assets/imgs/Upward.png"
      this.isUploadInfo = false
      this.uploadCardIcon = '../../../../../assets/imgs/Downward.png';
      this.isWillInfo = false
      this.isWillArrow = "../../../../../assets/imgs/Downward.png"
    } else if (this.isLockInfo == true){
      this.isLockInfo = false
      this.isLockArrow = "../../../../../assets/imgs/Downward.png"
    }
  }
  isMoreInfo = false;
  lockMoreInfo() {

    if(this.isMoreInfo == false) {
      this.isMoreInfo = true;
    } else if(this.isMoreInfo == true) {
      this.isMoreInfo = false;
    }
  }
}
