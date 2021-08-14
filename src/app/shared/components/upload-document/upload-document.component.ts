import { Record } from './../../../modules/home/home.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController, LoadingController, AlertController, NavController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService, NavigationService } from '@durity/services';
import { ConfirmPasswordComponent } from '../confirm-password/confirm-password.component';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { ContactServiceService } from '../../services/contact-service.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SetPasswordComponent } from '../set-password/set-password.component';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { ApiService } from 'src/app/services/api.service';
import { AddContactEmailComponent } from '../add-contact-email/add-contact-email.component';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { RecommendationsComponent } from '../../recommendations/recommendations.component';
import { AddContactsComponent } from '../signup-wizard/add-contacts/add-contacts.component';
import { UploadDocumentsService } from '../../services/upload-documents.service';
import { AttachmentsService } from '../../services/attachments.service';
import { UserEncryptionOptionsComponent } from '../user-encryption-options/user-encryption-options.component';
import { RecordsService } from '../../services/records.service';
import { Userrecords } from '../../../modules/home/userrecords.model';
import { Subscription } from 'rxjs';
import {Users} from './users.model';

declare var window: any;


@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],

})
export class UploadDocumentComponent implements OnInit {

  @Input () fileName: string;
  @Input () fileId: string;
   textFileName: string;
   textFileData: string;
   savedText: string;

  apiUrl = environment.apiUrl;
  attachments:any;
  isUserEncryptionEnabled: boolean;
  Beneficiaries: FormArray;
  beneficiaryForm: FormGroup;
  bytes: number;
  contacts: any = [];
  contactId: string;
  contactDetails: any = [];
  editableFileName: string;
  encryptedFileName: string;
  extraSecurity: boolean;
  filename: string;
  fileSize: string;
  fileExtension: string;
  fileNameToBeUploaded: string;
  textFile: string;
  header: HttpHeaders;
  httpOptions: { headers: HttpHeaders; };
  index: Array<{index: string}> = [];
  options;
  signInType: string;
  selectedBeneficiaries: any[];
  selectedContact: any = [];
  token: any;
  user: Array<string>;
  upload: string;
  userId: string;
  unselectedContact: any = [];
  private sStorageObject: SecureStorageObject;
  private uploadDate = Date();
  userEncryptionInfo: any = [];
  configuration: any;
  hashValue: any;
  userData: any;
  userDetails: any;
  advisorAccess: boolean = false;
  isAclient : boolean = false;
  isFinAdv : boolean = false;
  // users : any=["health Insurance","Life Insurance"];
  public recSub: Subscription;
  public records: Record[] = [];
  public userRecords: Userrecords[] = [];
  value = 'Med';
  arrayList: string[];
  category: any;
  // compareWith: (o1: any, o2: any) => boolean;
  sum: number = 0;

  constructor (
    private apiService: ApiService,
    private alertCtrl: AlertController,
    private attachmentService: AttachmentsService,
    private auth: AuthService,
    private contactService: ContactServiceService,
    private dialogs: Dialogs,
    private formBuilder: FormBuilder,
    public globalvariablesProvider: GlobalVariablesService,
    private http: HttpClient,
    private navCtrl: NavController,
    public loaderCtrl: LoadingController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    private navService: NavigationService,
    private popOverCtrl: PopoverController,
    private secureStorage: SecureStorage,
    public userService: UserService,
    private authService: AuthService,
    private uploadDocumentsService: UploadDocumentsService,
    private wizardService: SignupWizardService,
    public toastCtrl: ToastController,
    public recordService: RecordsService,
    public route: ActivatedRoute
   

  ) {
    this.recordService.getUserRecords();
    this.recSub = this.recordService.getRecordUpdateListener().subscribe((userrecord: Userrecords[]) => {
      this.userRecords = userrecord;
    });
    this.route.paramMap.subscribe((paramMap) => {
      console.log('hiiiiiiii');
      if ( paramMap.has('id')) {
          this.category = paramMap.get('id');
          console.log(this.category);
          // this.chooseCategory(this.category);
          // this.category = 'reddy ';
      } else{
          this.category = '';
      }
  });
    
    // this.compareWith = this.compareWithFn;
    

    this.userData = this.authService.currentUser.subscribe(user => ( this.userDetails = user));

  //   this.authService.configuration.subscribe((info) => {
  //     this.configuration = info;
  //     this.hashValue = this.configuration.userEncryptionHash;
  // });
    this.isAclient = this.globalvariablesProvider.isUserAclient;
  this.authService.currentUser.subscribe((info) => {
    this.configuration = info.configuration;
         this.hashValue = this.configuration.userEncryption.passwordHash;
           this.isFinAdv = info.profile.isFinancialAdvisor;
           
          console.log(" WWWWWWWW ", "isClient : ",this.isAclient," isFinAdv : ",this.isFinAdv)
      if(this.isFinAdv == true && this.isAclient == false){
          this.advisorAccess = true
      }else if(this.isFinAdv == false && this.isAclient == false){
        this.advisorAccess = false
      }else if(this.isFinAdv == true && this.isAclient == true){
        this.advisorAccess = true
      }
 });
  

    this.signInType = this.globalvariablesProvider.signInType;
    this.authService.currentUser.subscribe(data => this.configuration = data.configuration);
    this.isUserEncryptionEnabled = this.configuration.userEncryption.isEnabled;
    this.globalvariablesProvider.isUserEncryptionEnabled = this.isUserEncryptionEnabled;
    if (this.signInType === 'register') {
      this.registerContacts();
    } else if (this.signInType === 'login') {
      this.loginContacts();
    }
    this.getAttachments();
    this.http
    .get(`${this.apiUrl}/user/getUserDetails?email=${this.userDetails.email}`)
    .subscribe((res) => {
    this.userDetails = res;
    })

  }

  getAttachments () {
    this.apiService.get({ name: 'myFiles' }).subscribe(attachments => {
        this.attachments = attachments;
        console.log(this.attachments);
    }, error => {
    });

}

ionViewWillEnter () {
  console.log(this.category);
  this.signInType = this.globalvariablesProvider.signInType;

  if (this.signInType === 'register') {
    this.registerContacts();
  } else if (this.signInType === 'login') {
    this.loginContacts();
  }

}
chooseCategory(event){
  // this.category = event;
 
  this.category = event.target.value;
  console.log(event.target.value);
  console.log(event.detail.value);
  
}
compareFn(o1: Record , o2: Record) {
  return o1 == o2;
}
async toastForAddContcts(){
  const toast = await this.toastCtrl.create({
    duration: 8000,
    message: 'No contacts added! Please add contacts to assign beneficiaries.',
  });
  await toast.present();
}

  registerContacts () {
    this.apiService.get({name: 'Contacts'}).subscribe(data => {
      this.contacts = data;
      // if(this.contacts.length == 0){
      //   this.showNoContPopovr()
      // }
  }, error => {
  });
  }

  loginContacts () {
    this.apiService.get({name: 'Contacts'}).subscribe(data => {
      this.contacts = data;
      // if(this.contacts.length == 0){
      //   this.showNoContPopovr()
      // }
  }, error => {
  });
  }

  goBack () {
    console.log()
    // this.navService.navigateForword("/select-doc");

    this.navService.navigateBack();
    this.loaderCtrl.dismiss();
  }
  addContact () {
    console.log("*************")
    this.globalvariablesProvider.addMoreContacts = true;
    console.log("///////////////")
    this.navService.goto('contact-list')
    // navigateForword('contact-list');
  }

  Back () {
    this.modalCtrl.dismiss();
    // this.navService.navigateForword("/select-doc");

    this.navService.navigateBack();
  }

  async advAccess(){
    console.log("Advisor access toggle pressed : ",this.advisorAccess)
  
  }

  async checkIfEmailExists (contactId) {
    // if (contactId === 'add-contact') {
    //   this.globalvariablesProvider.addMoreContacts = true;
    //   this.navService.navigateForword('contact-list');
    // } else {
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

    // }

  }

  ngOnInit () {
    this.records.forEach(results =>{
      console.log(results);
    });
    console.log("byeee");
    this.authService.currentUser.subscribe(user => this.userId = user._id);
    // this.userId = this.globalvariablesProvider.userId;
    this.fileSize = this.wizardService.fileSize;
    console.log(this.fileSize);
    this.bytes = this.wizardService.size;
    this.upload = localStorage.getItem('Upload');
    this.token = this.auth.userToken;
    this.beneficiaryForm = this.formBuilder.group({
      Beneficiaries: this.formBuilder.array([
        this.addBeneficiary()
      ])
    });
    this.filename = this.wizardService.name;
    this.extraSecurity = false;
    this.editableFileName = this.filename.substring(0, this.filename.lastIndexOf('.'));
    this.fileExtension = this.filename.substring(this.filename.lastIndexOf('.'));
    
    this.uploadDocumentsService.share.subscribe(data => this.user = data);
}

addBeneficiary (): FormGroup {
  return this.formBuilder.group({
    contact_id: '',
    tier: '1',
  });
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

clicked (){
  console.log("======+++++++=======")
}
async showNoContPopovr () {
  console.log("------22222----")
  const alert = await this.alertCtrl.create({
 
    subHeader:'You have not added any contacts yet! Make sure you have contacts added to assign them as a beneficiary.',
      buttons:[ 
            {
              text: 'Cancel',
              role: 'cancel',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
        },
        {
          text: 'Add Contact',
          handler: () => {
            this.globalvariablesProvider.addMoreContacts = true;
            this.navService.navigateForword('contact-list');
          }
        }]
  });
  await alert.present();
}

deleteBen (i) {
  this.Beneficiaries.removeAt(i);
}


beneficiariesAdded () {
  this.selectedBeneficiaries = this.beneficiaryForm.value.Beneficiaries;
  this.uploadDocumentsService.addUser(this.selectedBeneficiaries);
  }

async uploadFile (typeofUpload, key, acessType, filename) {
  if(this.attachments.length >= this.userDetails.userCurrentPlanDetails.noOfFilesLimit){
    this.numberOfFilesAlert(this.userDetails.userCurrentPlanDetails.noOfFilesLimit);
    console.log(this.userDetails.userCurrentPlanDetails);
  } else {
    console.log(this.userDetails.userCurrentPlanDetails);
    if (this.userDetails.userCurrentPlanDetails.planName === 'GOLD') {
        var abc = parseInt(this.fileSize);
        if (abc >= 10) {
          this.fileSizeLimitAlert(10);
        } else {
          this.beneficiariesAdded();
          this.fileNameToBeUploaded = filename.concat(this.fileExtension);
          this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(false, key, this.advisorAccess, acessType, this.fileNameToBeUploaded,false,this.category,);
        }
    } else if (this.userDetails.userCurrentPlanDetails.planName === 'PLATINUM') {
       var def;
       this.apiService.get({ name: 'myFiles' }).subscribe(
      (attachments) => {
        for(let i = 0; i< attachments.length; i++){
          def = attachments[i].original_filesize.split('.');
          this.sum += parseInt(def[0]);
        }
        console.log('sum', this.sum);
        var abc = parseInt(this.fileSize) + this.sum;
        if (abc >= 50) {
          this.fileSizeLimitAlert(50);
        } else {
          this.beneficiariesAdded();
          this.fileNameToBeUploaded = filename.concat(this.fileExtension);
          this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(false, key, this.advisorAccess, acessType, this.fileNameToBeUploaded,false,this.category,);
        }

      });
      } else {
         var def;
         this.apiService.get({ name: 'myFiles' }).subscribe(
           (attachments) => {
         for(let i = 0; i< attachments.length; i++){
          def = attachments[i].original_filesize.split('.');
          this.sum += parseInt(def[0]);
        }
         console.log('sum', this.sum);
         var abc = parseInt(this.fileSize) + this.sum;
         if (abc >= 300) {
          this.fileSizeLimitAlert(300);
        } else {
          this.beneficiariesAdded();
          this.fileNameToBeUploaded = filename.concat(this.fileExtension);
          this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(false, key, this.advisorAccess, acessType, this.fileNameToBeUploaded,false,this.category,);
        }

      });
      }
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

addMoreBeneficiaries () {
  this.selectedBeneficiaries = this.beneficiaryForm.value.Beneficiaries;
  this.uploadDocumentsService.addUser(this.selectedBeneficiaries);
  this.apiService.post(`myFiles/selectTiers`, {file: {file_id: this.fileId, filename: this.fileName}, beneficiaries: this.beneficiaryForm.value.Beneficiaries })
  .subscribe((data) => {
  });
  if (this.fileName.substring(this.fileName.lastIndexOf('.') + 1) === 'encrypt') {
    this.navService.navigateForword('/share-details');
    this.modalCtrl.dismiss();
    } else {
      this.modalCtrl.dismiss();
      this.navService.navigateBack ();
    }
}

async biometricEncryption(typeofUpload, key, acessType, filename){
  // var biometricKey = this.generatePublicKey();
  // console.log(biometricKey);
  this.fileNameToBeUploaded = filename.concat(this.fileExtension);
  this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(false, '', this.advisorAccess, 'log-in', this.fileNameToBeUploaded, true);

}

// async generatePublicKey() {
//   window.cordova.plugins.CustomBiometricPlugin.generatePublicKey(2048, "mdurity",
//     (r) => {
//       console.log(r);
//       return r;
//     },
//     (e) => {console.log(e);return e.toString()}
//   );
// }

async encryptUpload (filename) {
  if(this.attachments.length >= this.userDetails.userCurrentPlanDetails.noOfFilesLimit){
    this.numberOfFilesAlert(this.userDetails.userCurrentPlanDetails.noOfFilesLimit);
  }else{
  var abc = parseInt(this.fileSize);
  if (abc >= 10) {
    // this.fileSizeLimitPop();
    this.fileSizeLimitAlert(10);
  } else {
    this.beneficiariesAdded();
    this.encryptedFileName = filename.concat(this.fileExtension);
      const popover = await this.popOverCtrl.create({
      component: UserEncryptionOptionsComponent,
      backdropDismiss: false,
      cssClass: 'myadditonalEncOpts-popover',
      componentProps: { flagType: true, fileName: this.encryptedFileName, documentType: 'document', isUserEncryptionEnabled: this.isUserEncryptionEnabled, hashValue: this.hashValue, advisorAccess: this.advisorAccess },
      translucent: true
      });
    return await popover.present();
    
  //   if (this.isUserEncryptionEnabled === true && this.hashValue === (null || undefined)) {
  //   const popover = await this.popOverCtrl.create({
  //     component: SetPasswordComponent,
  //     backdropDismiss: false,
  //     cssClass: 'custom-popOver',
  //     componentProps: {fileName: this.encryptedFileName, documentType: 'document'},
  //     translucent: true
  //     });
  //   return await popover.present();
  // } else if (this.isUserEncryptionEnabled === false || (this.isUserEncryptionEnabled === true && this.hashValue !== (null || undefined))) {
  // const popOver = await this.popOverCtrl.create({
  //   component: ConfirmPasswordComponent,
  //   backdropDismiss: false,
  //   cssClass: 'custom-confirmpass',
  //   componentProps: { flagType: true, fileName: this.encryptedFileName, documentType: 'document'}
  //   });
  // return await popOver.present();
  // }
    }
   }
  }

   async fileSizeLimitAlert(filesize: number) {
    const alertFailure = this.alertCtrl.create({
      header: `Upload Failed!`,
      subHeader: `Please choose file less than ` + filesize + ` MB`,
      buttons: ['Ok']
    });
    return (await alertFailure).present();
  }

  async numberOfFilesAlert(noOfFilesAsPerPlan) {
    if(noOfFilesAsPerPlan == 1){
      var addNoOfFilesWithAddlSentence = noOfFilesAsPerPlan + ' file';
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


}
