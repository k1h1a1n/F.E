import { Component, OnInit } from '@angular/core';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ContactServiceService } from '../../services/contact-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../services/user.service';
import { NavigationService } from '../../services/navigation.service';
import { LoadingController, ModalController, PopoverController, NavParams, AlertController } from '@ionic/angular';
import { AddContactEmailComponent } from '../add-contact-email/add-contact-email.component';
import { ApiService } from 'src/app/services/api.service';
import { RequestOptions } from '@angular/http';
import { SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { ConfirmPasswordComponent, SetPasswordComponent } from '..';
import { UploadDocumentsService } from '../../services/upload-documents.service';
import { RecommendationsComponent } from '../../recommendations/recommendations.component';
import { UserEncryptionOptionsComponent } from '../user-encryption-options/user-encryption-options.component'


@Component({
  selector: 'app-text-note-upload',
  templateUrl: './text-note-upload.component.html',
  styleUrls: ['./text-note-upload.component.scss'],
})
export class TextNoteUploadComponent implements OnInit {
  cancelText: any;
  okText: any;
  advisorAccess: boolean = true;
  isAclient : boolean = false;
  userDetails: any;
  attachments:any;


  constructor (
    private authService: AuthService,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private contactService: ContactServiceService,
    private formBuilder: FormBuilder,
    public globalvariablesProvider: GlobalVariablesService,
    private http: HttpClient,
    private loaderCtrl: LoadingController,
    private modalCtrl: ModalController,
    private navService: NavigationService,
    private popOverCtrl: PopoverController,
    private uploadDocumentsService: UploadDocumentsService

  ) {
    // this.userData = this.authService.currentUser.subscribe(user => ( this.userDetails = user));
    this.isAclient = this.globalvariablesProvider.isUserAclient;

    this.authService.currentUser.subscribe((info) => {
      this.configuration = info.configuration;
      this.userDetails = info
           this.hashValue = this.configuration.userEncryption.passwordHash;
       

   });

  //   this.authService.configuration.subscribe((info) => {
  //     this.configuration = info;
  //     this.hashValue = this.configuration.userEncryptionHash;
  // });

    this.authService.currentUser.subscribe(data => this.configuration = data.configuration);
    this.isUserEncryptionEnabled = this.configuration.userEncryption.isEnabled;
    this.getAttachments();
    this.signInType = this.globalvariablesProvider.signInType;
    if (this.signInType === 'register') {
      this.registerContacts();
    } else if (this.signInType === 'login') {
      this.loginContacts();
    }

  }
  private uploadDate = Date();
  apiUrl = environment.apiUrl;
  beneficiaryForm: FormGroup;
  Beneficiaries: FormArray;
  contactDetails: any = [];
  contacts: any = [];
  documentType = 'text-note';
  extraSecurity: boolean;
  editableFileName: string;
  httpOptions: { headers: HttpHeaders; };
  header: HttpHeaders;
  private sStorageObject: SecureStorageObject;
  selectedBeneficiaries: any[];
  signInType: string;
  textNoteData: any;
  token: string;
  userId: string;
  configuration: any;
  hashValue: string;
  isUserEncryptionEnabled: any;


  ngOnInit () {

    this.authService.currentUser.subscribe(user => this.userDetails = user);
    this.userId = this.userDetails._id;
    this.userId = this.globalvariablesProvider.userId;
    this.token = this.authService.userToken;
    this.extraSecurity = false;
    const headers = new HttpHeaders({});
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('content-type', 'application/json');
    this.httpOptions = { headers };
    this.header = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: this.token,
    });
    this.textNoteData = this.uploadDocumentsService.textNoteData;
    this.editableFileName = this.uploadDocumentsService.textNoteTitle;
    this.beneficiaryForm = this.formBuilder.group({
      Beneficiaries: this.formBuilder.array([
        this.addBeneficiary()
      ])
    });
  }
  goBack () {
    this.navService.navigateBack();
    this.loaderCtrl.dismiss();
  }

  getAttachments () {
    this.apiService.get({ name: 'myFiles' }).subscribe(attachments => {
        this.attachments = attachments;
        console.log(this.attachments);
    }, error => {
    });

}

  Back () {
    this.modalCtrl.dismiss();
    this.navService.navigateForword(['select-doc']);
  }

  deleteBen (i) {
    this.Beneficiaries.removeAt(i);
  }
  addContact () {
    this.globalvariablesProvider.addMoreContacts = true;
    this.navService.navigateForword('contact-list');
  }
  addBeneficiary (): FormGroup {
    return this.formBuilder.group({
      contact_id: '',
      tier: '1',
    });
  }
  beneficiariesAdded () {
    this.selectedBeneficiaries = this.beneficiaryForm.value.Beneficiaries;
    this.uploadDocumentsService.addUser(this.selectedBeneficiaries);
    }

  addMore (): void {
    this.Beneficiaries = this.beneficiaryForm.get('Beneficiaries') as FormArray;
    this.Beneficiaries.push(this.addBeneficiary());
    if (this.signInType === 'register') {
      this.registerContacts ();
    } else if (this.signInType === 'login') {
      this.loginContacts ();
    }
  }

  registerContacts () {
    this.apiService.get({name: 'Contacts'}).subscribe(data => {
      this.contacts = data;
  }, error => {
  });
  }

  loginContacts () {
    this.contactService.contactsStream.subscribe((data) => {
      this.contacts = data;
    });

  }

  async checkIfEmailExists (contactId) {
    if (contactId === 'Add Contact') {
      this.globalvariablesProvider.addMoreContacts = true;
      this.navService.navigateForword('contact-list');
    }
    this.contactService.getContactDetailsbyId (contactId)
    .then(async contact => {
      this.contactDetails = contact;
      if (this.contactDetails.primaryEmail === ' ') {
        const modal = await this.modalCtrl.create({
                component: AddContactEmailComponent,
                backdropDismiss: false,
                cssClass: 'add-email-modal',
                componentProps: {contactId: this.contactDetails._id, contactName: this.contactDetails.firstName, contactNumber: this.contactDetails.mobilePhone, contactEmail: this.contactDetails.primaryEmail, contactRelation: this.contactDetails.relationship}
                });
        return await modal.present();

      }
      this.loginContacts ();
    });

  }
  async advAccess(){
    console.log("Advisor access toggle pressed : ",this.advisorAccess)
  
  }
  encryptAndUploadFileForBothIosAndAndroid (extraSecurity, key, acessType, filename) {
    if(this.attachments.length >= this.userDetails.userCurrentPlanDetails.noOfFilesLimit){
      this.numberOfFilesAlert(this.userDetails.userCurrentPlanDetails.noOfFilesLimit);
    }else{
    this.beneficiariesAdded();
    this.uploadDocumentsService.uploadTextNote(extraSecurity, key,this.advisorAccess, acessType, filename, this.textNoteData, false );
  }
  }

  async numberOfFilesAlert(noOfFilesAsPerPlan) {
    if(noOfFilesAsPerPlan == 1){
      var addNoOfFilesWithAddlSentence = noOfFilesAsPerPlan+" file";
     }else{
         addNoOfFilesWithAddlSentence = noOfFilesAsPerPlan+" files";
     }
     const alertFailure = this.alertCtrl.create({
       header: `Upload Failed!`,
       subHeader: `Your current plan limits you to upload `+addNoOfFilesWithAddlSentence+`. Please upgrade your plan to upload this file and enjoy more benefits.`,
       buttons: ['Ok']
     });
     return (await alertFailure).present();
  }


 async encryptUpload (filename) {
  if(this.attachments.length >= this.userDetails.userCurrentPlanDetails.noOfFilesLimit){
    this.numberOfFilesAlert(this.userDetails.userCurrentPlanDetails.noOfFilesLimit);
  }else{
  this.beneficiariesAdded();
    // this.encryptedFileName = filename.concat(this.fileExtension);
      const popover = await this.popOverCtrl.create({
      component: UserEncryptionOptionsComponent,
      backdropDismiss: false,
      cssClass: 'additonalEncOpts-popover',
      componentProps: { flagType: true, fileName: filename, documentType: 'text-note', textNoteData: this.textNoteData, isUserEncryptionEnabled: this.isUserEncryptionEnabled, hashValue: this.hashValue },
      translucent: true
      });
    return await popover.present();
  // if (this.hashValue !== (null || undefined)) {
  //     const popOver = await this.popOverCtrl.create({
  //       component: ConfirmPasswordComponent,
  //       cssClass: 'custom-confirmpass',
  //       componentProps: { flagType: true, fileName: filename, documentType: 'text-note', textNoteData: this.textNoteData}
  //       });
  //     return await popOver.present();
  //   } else {
  //     const popover = await this.popOverCtrl.create({
  //       component: SetPasswordComponent,
  //       cssClass: 'custom-popOver',
  //       componentProps: {fileName: filename, documentType: 'text-note', textNoteData: this.textNoteData},
  //       translucent: true
  //       });
  //     return await popover.present();
  //   }
    }

  }

  async AddRec () {
    const popover = await this.popOverCtrl.create({
    component: RecommendationsComponent,
    translucent: true,
    backdropDismiss: false,
    cssClass: 'custom-popoverEncryption'
  });
    return await popover.present();
}

}
