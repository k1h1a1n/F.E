import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { NavController, ModalController, AlertController, LoadingController, ToastController, PopoverController } from '@ionic/angular';
import { ContactServiceService } from '../../services/contact-service.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfirmPasswordComponent } from '../confirm-password/confirm-password.component';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { DeletePopoverComponent } from '../delete-popover/delete-popover.component';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { DownloadDocumentService } from '../../services/download-document.service';
import { AttachmentsService } from '../../services/attachments.service';
import { UploadDocumentsService } from '../../services/upload-documents.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { WillDisclaimerComponent } from '../enter-file-download-otp/enter-file-download-otp.component';
import { EnterOTPandDecryptFileComponent } from '../enter-otpand-decrypt-file/enter-otpand-decrypt-file.component';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { ShowFileDetailsComponent } from '../show-file-details/show-file-details.component';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RecommendationsComponent } from '../../recommendations/recommendations.component';
import { AddContactEmailComponent } from '../add-contact-email/add-contact-email.component';



declare var window: any;

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss'],
})
export class ViewDocumentComponent implements OnInit {
  url = environment.apiUrl;
  attachments = [];
  contacts = [];
  beneficiary1: any = [{}];
  beneficiary2: any = [{}];
  beneficiary3: any = [{}];
  contact: string;
  contactId: any = [];
  selBen:Boolean = false;
  dataReturned: any;
  document: any;
  extension: string;
  isBiometricEnabled: any;
  fileExtension: string;
  selectedBeneficiaries: any[];
  selectedContact: any = [];
  Beneficiaries: FormArray;
  beneficiaryForm: FormGroup;
  contactDetails: any = [];
  showerr: boolean = false;
  category: string;
  fileName: any;
  fileId: string;
  isEncrypted: boolean;
  lockToshow:boolean = false;
  index: string;
  isUserEncrypted: any;
  biometricDecryptKey: any;
  name: any = [{}];
  tier1: Array<{}> = [];
  tier2: Array<{}> = [];
  tier3: Array<{}> = [];
  userId: string;
  hybridEncTag: string;
  userFileEncKeyhash:string;
  userFileEncIv:string;
  userFileEncTag:string;
  uploadedDate: string;
  all: string[];
  fileSize: string;
  alert: any;
  nofileSize = false;
  user;
  advisorAccess:any ;
  isFinAdv:any;
  editableFileName:any;
  editFile:boolean = false;
  isFileUserEncrpted:boolean = false;
  isFileBioMetricEncrypted:boolean = false;
  // customPopoverOptions: any = {
  //   header: 'Hair Color',
  //   subHeader: 'Select your hair color',
  //   message: 'Only select your dominant hair color'
  // };
  


  constructor (
               public alertCtrl: AlertController,
               private androidPermissions: AndroidPermissions,
               public navService: NavigationService,
               public navCtrl: NavController,
               public loadingCtrl: LoadingController,
               private attachmentService: AttachmentsService,
               private apiService: ApiService,
               public toastCtrl: ToastController,
               private formBuilder: FormBuilder,
              //  private EnterOTPandDecryptFileComponent: EnterOTPandDecryptFileComponent,
               private contactService: ContactServiceService,
               public globalvariablesProvider: GlobalVariablesService,
               private route: ActivatedRoute,
               private authService: AuthService,
               public modalCtrl: ModalController,
               private globalVariablesProvider: GlobalVariablesService,
               private downloadDocumentService: DownloadDocumentService,
               private uploadDocumentsService: UploadDocumentsService,
               private popOverCtrl: PopoverController,
               private wizardService: SignupWizardService


  ) {
    
  }

  ionViewWillEnter () {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      console.log(this.user.profile)
      this.isFinAdv = this.user.profile.isFinancialAdvisor;
    });
    this.apiService.get({name: 'Contacts'}).subscribe(contacts => {
      this.contacts = contacts;
      console.log("contacts : ",this.contacts);
      this.attachmentService.getAttachments();
      this.attachmentService.attachmentStream.subscribe(data => {
        if(this.isFinAdv == true){
          this.attachments = [];
          for (let i = 0; i < this.attachmentService.attachments.length; i++) {
            if(this.attachmentService.attachments[i]['advisorAccess'] == true || this.attachmentService.attachments[i]['advisorAccess'] == (undefined || null)){
            this.attachments.push(this.attachmentService.attachments[i]);
            }
          }
        }else{
          this.attachments = this.attachmentService.attachments;
        }
       
        // this.attachments = data;
        this.route.paramMap.subscribe(params => {
          this.index = params.get('index');
          this.document = this.attachments[this.index];
          this.fileName = this.document.filename;
          this.isFileUserEncrpted = this.document.isUserEncrypted;
          this.isFileBioMetricEncrypted = this.document.isBiometricEnabled;
          this.fileId = this.document.file_id;
          this.fileExtension = this.fileName.substring(this.fileName.lastIndexOf('.') + 1);
          this.uploadedDate = this.document.uploaded_user_date;
          this.isEncrypted = this.document.isEncrypted;
          this.userFileEncKeyhash = this.document.userFileEncKeyHash;
          this.userFileEncIv = this.document.userFileEncIv;
          this.userFileEncTag = this.document.userFileEncTag;
          this.hybridEncTag = this.document.hybridEncTag;
          this.isUserEncrypted = this.document.isUserEncrypted;
          this.isBiometricEnabled = this.document.isBiometricEnabled;
          this.category = this.document.category
          if(this.isUserEncrypted == true || this.isBiometricEnabled == true){
            this.lockToshow = true;
          }
          if (this.document.original_filesize !== (undefined || null)) {
            this.fileSize = this.document.original_filesize;
          }
          if (this.fileName.substring(this.fileName.lastIndexOf('.') + 1) === 'html'){
            this.nofileSize = true;
          }
          this.editableFileName = this.fileName.substring(0, this.fileName.lastIndexOf('.'));

         console.log(this.editableFileName,'^^^^^^',this.fileExtension);
        
         
        });
        // this.getBeneficiaries();
      });
      this.getBeneficiaries();

      if(this.globalVariablesProvider.isUserAclient == true){
        console.log("----- : ", this.document)
        if(this.document.advisorAccess == (undefined || null)){
           this.advisorAccess = true;
        }else{
          this.advisorAccess = this.document.advisorAccess;
        }
      }
    });

  }

  ngOnInit () {
    this.beneficiaryForm = this.formBuilder.group({
      Beneficiaries: this.formBuilder.array([
        this.addBeneficiary()
      ])
    });
  }

  getBeneficiaries () {
    this.Beneficiaries = this.beneficiaryForm.get('Beneficiaries') as FormArray;
    this.attachmentService.getBeneficiaries(this.index);
    this.tier1.length = 0;
    this.tier2.length = 0;
    this.tier3.length = 0;
    this.document = this.attachments[this.index];
    this.document.Beneficiary1.forEach(contact => {
      this.contactService.getContactDetailsbyId(contact.contactId).then(res => {
        this.beneficiary1 = res;
        this.tier1.push(this.beneficiary1);
        this.Beneficiaries.push(this.getExisitngBenef(contact.contactId,'1'));

      });
    });

    this.document.Beneficiary2.forEach(contact => {
      this.contactId = contact.contactId;
      this.contactService.getContactDetailsbyId(contact.contactId).then(res => {
        this.beneficiary2 = res;
        this.tier2.push(this.beneficiary2);
        this.Beneficiaries.push(this.getExisitngBenef(contact.contactId,'2'));
      });
    });

    this.document.Beneficiary3.forEach(contact => {
      this.contactService.getContactDetailsbyId(contact.contactId).then(res => {
        this.beneficiary3 = res;
        this.contactId = res;
        this.tier3.push(this.beneficiary3);
        this.Beneficiaries.push(this.getExisitngBenef(contact.contactId,'3'));

      });
    });
  }

  async showFileDetails () {
    const popover = await this.popOverCtrl.create({
      component: ShowFileDetailsComponent,
      componentProps: { filename: this.fileName, filesize: this.fileSize, ext: this.fileExtension, uploadedDate: this.uploadedDate, category: this.category },
      cssClass: 'showFileDetails-popover',
      });
    await popover.present();
  }
  goBack () {
    console.log('back')
    this.navCtrl.back();
  }

  abcd () {
    this.selBen = !this.selBen;
  }
  editDetails () {
    this.editFile = true;
    // if(this.contacts.length == 0){
    //   this.showNoContPopovr()
    // }
  }

  cancelEditDetails () {
    this.editFile = false;
  }

 async updateDetails () {
    if(this.editableFileName == '' || this.editableFileName == (null || undefined)){
      this.showerr = true;
      const toast = await this.toastCtrl.create({
        duration: 4000,
        message:
          "Please enter file name.",
      });
      await toast.present();
    }else{
      this.showerr = false;
      this.editFile = false;
      this.addMoreBeneficiaries();
    }
    
  }
  goto (pageName, data?) {
    this.navService.goto(pageName, data);
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
    // if (this.signInType === 'register') {
    //   this.registerContacts ();
    // } else if (this.signInType === 'login') {
      this.loginContacts ();
    // }
  }

  getExisitngBenef (contact_id,tier): FormGroup {
    return this.formBuilder.group({
      contact_id: contact_id,
      tier: tier,
    });
  }

  // getMore () :void {
  //   this.Beneficiaries = this.beneficiaryForm.get('Beneficiaries') as FormArray;
  //   this.Beneficiaries.push(this.getExisitngBenef());
  //   // if (this.signInType === 'register') {
  //   //   this.registerContacts ();
  //   // } else if (this.signInType === 'login') {
  //     this.loginContacts ();
  //   // }
  // }

  loginContacts () {
    // this.contactService.contactsStream.subscribe((data) => {
    //   this.contacts = data;
    // });
    this.apiService.get({name: 'Contacts'}).subscribe(data => {
      this.contacts = data;
      // if(this.contacts.length == 0){
      //   this.showNoContPopovr()
      // }
  }, error => {
  });
  }
  
 async deleteBen (i,benef) {
   if(benef.value.tier == '1'){
    var tiervale = 'tier 1'
   }else if(benef.value.tier == '2'){
     tiervale = 'tier 2'

   }else{
     tiervale = 'tier 3'

   }
    const modal = await this.modalCtrl.create({
      component: DeletePopoverComponent,
      cssClass: 'simple-delete-modal',
      componentProps: { deleteType: 'revokeAccess', fileId: this.fileId, fileName: this.fileName, contactId: benef.value.contact_id, tier: tiervale, index: this.index }
    });
    await modal.present();
    // this.revokeAccess(this.fileId,this.fileName,benef.value.contact_id,benef.value.tier)
    this.Beneficiaries.removeAt(i);
    console.log(benef.value)
    
  }
  
  
  beneficiariesAdded () {
    this.selectedBeneficiaries = this.beneficiaryForm.value.Beneficiaries;
    this.uploadDocumentsService.addUser(this.selectedBeneficiaries);
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

  async checkIfEmailExists (contactId) {
    console.log(contactId)
    if (contactId === 'add-contact') {
      this.globalvariablesProvider.addMoreContacts = true;
      this.navService.navigateForword('contact-list');
    } else {
      this.contactService.getContactDetailsbyId (contactId)
    .then(async contact => {
      console.log(contact)
      this.contactDetails = contact;
      if (this.contactDetails.primaryEmail === ' ' || this.contactDetails.primaryEmail === "") {
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

  }
  
  async toastForAddContcts(){
    const toast = await this.toastCtrl.create({
      duration: 8000,
      message: 'No contacts added! Please add contacts to assign beneficiaries.',
    });
    await toast.present();
  }

  async showNoContPopovr () {
    console.log("------11111----")
    // this.globalvariablesProvider.addMoreContacts = true;
    // this.navService.navigateForword('contact-list');
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

  addMoreBeneficiaries () {
    this.selectedBeneficiaries = this.beneficiaryForm.value.Beneficiaries;
    console.log(' %%^^&&**(()) : ',this.selectedBeneficiaries)
    this.uploadDocumentsService.addUser(this.selectedBeneficiaries);
    this.apiService.post(`myFiles/updateBenef`, {file: {file_id: this.fileId, filename: this.editableFileName+'.'+this.fileExtension}, beneficiaries: this.beneficiaryForm.value.Beneficiaries })
    .subscribe((data) => {
    });
    if (this.isFileUserEncrpted == true) {
      this.navService.navigateForword('/share-details');
      this.modalCtrl.dismiss();
      } else {
        this.modalCtrl.dismiss();
        this.navService.navigateBack ();
      }
  }
  // public async download (documentId, filename: string) {
    
  //   this.downloadDocumentService.checkAndroidPermissions ()
  //   .then (async (status) => {
  //     this.downloadDocumentService.presentSpinner('Download in Progress...');
  //     await this.downloadDocumentService.downloadFile(documentId, filename, this.isEncrypted)
  //       .then(data => {
  //         let fileUrl: string;
  //         fileUrl = data;
  //         if(this.isEncrypted == false){
  //           this.loadingCtrl.dismiss();
  //           this.downloadDocumentService.downloadSuccessAlert(filename);
  //           this.downloadDocumentService.pushNotificationToStatusBar(fileUrl, filename);
  //         }else if(this.isEncrypted == undefined || this.isEncrypted == null || this.isEncrypted == true){
  //          // this.enterOtp(documentId,filename);
  //           this.downloadDocumentService.getKeysByFileId(documentId)
  //           .then(keyNiv => {
  //           //  var keyNiv = this.downloadDocumentService.keyNIv;
  //             this.uploadDocumentsService.decryptFile(data, keyNiv['hybridEncKey'], keyNiv['hybridEncIv'], this.hybridEncTag, '', false)
  //               .then((ext) => {

  //                 this.fileExtension = ext;
  //                 this.loadingCtrl.dismiss();
  //                 if (this.fileExtension.substring(this.fileExtension.lastIndexOf('.') + 1) !== 'encrypt') {
  //                   this.downloadDocumentService.downloadSuccessAlert(filename);
  //                   this.downloadDocumentService.pushNotificationToStatusBar(fileUrl, filename);
  //                 } else if (this.fileExtension.substring(this.fileExtension.lastIndexOf('.') + 1) === 'encrypt') {
  //                   this.presentConfirmModal(fileUrl, documentId, filename, this.userFileEncKeyhash, this.userFileEncIv, this.userFileEncTag);
  //                 }
  //               }, (error) => {
  //                 this.loadingCtrl.dismiss();
  //                 this.downloadDocumentService.downloadFailedAlert(filename);
  //               }
  //               );
  //           });
  //         }
  //     }, err => {
  //     });

  //   }, err => {
  //     this.accessDeniedAleart ();
  //   });
  // }

  public async download(documentId, filename: string){
    this.downloadDocumentService.checkAndroidPermissions ()
    .then (async (status) => {
      this.downloadDocumentService.presentSpinner('Please wait...');
      await this.downloadDocumentService.downloadFile(documentId, filename, this.isEncrypted)
      .then(async (data) => {
        let fileUrl: string;
        fileUrl = data;
        console.log(fileUrl);
        if(this.isEncrypted!=undefined){
          this.checkEncryption(this.isEncrypted,fileUrl,filename,documentId)
        }else{
          
          this.downloadFile(filename,fileUrl);
        }
        
      })

      
    },
    err =>{
      this.accessDeniedAleart();
    })
  }

  async checkEncryption(isEncrypted,fileUrl,filename,documentId){
    if(isEncrypted == true){
      this.loadingCtrl.dismiss();
      await this.enterOtp(documentId,filename,fileUrl).then((res)=>{
      
       })
       }else{
        this.loadingCtrl.dismiss();
         this.downloadFile(filename,fileUrl);
     }
  }

  public downloadFile(filename,fileUrl) {
    this.loadingCtrl.dismiss();
          this.downloadDocumentService.downloadSuccessAlert(filename);
          this.downloadDocumentService.pushNotificationToStatusBar(fileUrl, filename);
  }

  async advAccess(){
    // this.advisorAccess = !this.advisorAccess
    console.log("Advisor access toggle pressed : ",this.advisorAccess)
    this.apiService.post(`myFiles/updateFileAdvAccess`, {file: {file_id: this.fileId, advisorAccess: this.advisorAccess}})
    .subscribe((data) => {
    });
  }
  // async enterOtp(documentId :any ,filename: String, fileUrl:any){
  //   this.authService.currentUser.subscribe((user) => {
  //     this.user = user;
  //   });
  //   this.apiService.post('user/sendOTP', {mobileNumber:this.user.profile.telephoneNumber}).subscribe(async (data) => {
  //     const popover = await this.popOverCtrl.create({
  //       component: WillDisclaimerComponent,
  //       componentProps: {fileId: documentId, filename: filename },
  //       cssClass: 'enterFileDownloadOtp-popover',
  //       });
  //     return await popover.present();
  // }), (error: any) => {
  // };
  // }
  public async downloadAfterOtpVerification (data,keyNiv,filename,documentId) {
     
    this.uploadDocumentsService.decryptFile(data, keyNiv['hybridEncKey'], keyNiv['hybridEncIv'], this.hybridEncTag, '', false)
    .then((ext) => {
      this.fileExtension = ext;
      this.loadingCtrl.dismiss();
      // if (this.fileExtension.substring(this.fileExtension.lastIndexOf('.') + 1) !== 'encrypt') {
        this.downloadDocumentService.downloadSuccessAlert(filename);
        this.downloadDocumentService.pushNotificationToStatusBar(data, filename);
    //   } else if (this.fileExtension.substring(this.fileExtension.lastIndexOf('.') + 1) === 'encrypt') {
    //     if(this.isBiometricEnabled){
          
    //     }else{
    //     this.presentConfirmModal(data, documentId, filename, this.userFileEncKeyhash, this.userFileEncIv, this.userFileEncTag, this.hybridEncTag);
    //   }
    // }
    }, (error) => {
      this.loadingCtrl.dismiss();
      this.downloadDocumentService.downloadFailedAlert(filename);
    }
    );
  }

  biometricDecrypt(fileUrl,data,filename,documentId) {
    this.presentAlert();
    window.cordova.plugins.CustomBiometricPlugin.decryptAfterBiometric(
      data['hybridEncKey'], "mdurity",
      (res) => {
        this.alert.message = '<ion-icon name="checkmark-circle"></ion-icon>';
       console.log(res);
        // this.biometricDecryptKey = res;
        data['hybridEncKey'] = res;
        document.querySelector('body');
        this.alertCtrl.dismiss();
        this.downloadAfterOtpVerification(fileUrl,data,filename,documentId)
        // return res;
      },
      (e) => console.error(e)
    );
  }

  async presentAlert() {
    this.alert = await this.alertCtrl.create({
      cssClass: 'customLoader',
      subHeader: 'Authenticate using Biometric',
      message: `<ion-icon name="finger-print" color={{'danger'}}></ion-icon>`,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.cancellFingerprintAuth();
        }
      },]
    });
    await this.alert.present();
  }

  cancellFingerprintAuth() {
    window.cordova.plugins.CustomBiometricPlugin.cancellFingerprintAuth(
      (r) => { console.log(r) },
      (e) => console.log(e)
    );
  }

  public async enterOtp(documentId :any ,filename: String,fileUrl:any){
    this.loadingCtrl.dismiss();
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
    if(this.user.profile.telephoneNumber == ''){
      const toast = await this.toastCtrl.create({
        duration: 5000,
        message: 'For extra security, we send an OTP to your phone. Please enter a valid phone in the Profile section before trying to download the file.',
      });
      await toast.present();
      // this.authService.presentToast("For extra security, we send an OTP to your phone. Please enter a valid phone in the Profile section before trying to download the file.");
    }
    else{
   this.apiService.post('user/sendOTP', {mobileNumber:this.user.profile.telephoneNumber}).subscribe(async (data1) => {
      const popover = await this.popOverCtrl.create({
        component: EnterOTPandDecryptFileComponent,
        componentProps: {fileId: documentId, filename: filename, telephoneNumber:this.user.profile.telephoneNumber,
           fileUrl:fileUrl, isBiometricEnabled:this.isBiometricEnabled, hybridEncTag:this.hybridEncTag,
           isUserEncrypted:this.isUserEncrypted,
           userFileEncKeyhash:this.userFileEncKeyhash, userFileEncIv:this.userFileEncIv, userFileEncTag:this.userFileEncTag, },
        cssClass: 'enterFileDownloadOtp-popover',
        });
      await popover.present();
  }), (error: any) => {
  }; 
  }
  }
  

 public async decryptRndKeyWithUserKeyAndDownloadFile(data,keyNiv,filename,documentId){
  this.presentConfirmModal(data, documentId, filename, keyNiv, this.userFileEncIv, this.userFileEncTag,this.hybridEncTag);


    // this.uploadDocumentsService.decryptFile(data, keyNiv['hybridEncKey'], keyNiv['hybridEncIv'], this.hybridEncTag, '', false)
    // .then((ext) => {
    //   this.fileExtension = ext;
    //   this.loadingCtrl.dismiss();
     
    // }, (error) => {
    //   this.loadingCtrl.dismiss();
    //   this.downloadDocumentService.downloadFailedAlert(filename);
    // }
    // );
  }

accessDeniedAleart () {
    let newVar: any;
    newVar = window.navigator;
    newVar.notification.alert(
        'Download Failed',   // the message
        function () { },                      // a callback
        'Access Denied',                            // a title
        'OK'                                // the button text
    );
  }

async presentConfirmModal(savedFileurl: string, documentId, filename: string, keyNIV, userFileEncIv, userFileEncTag, hybridEncTag) {
    const modal = await this.modalCtrl.create({
      component: ConfirmPasswordComponent,
      cssClass: 'custom-confirmpass',
      componentProps: {
        fileUrl: savedFileurl, flagType: false, fileId: documentId, fileName: filename, keyNIV:keyNIV, userFileEncIv:userFileEncIv, userFileEncTag:userFileEncTag, hybridEncTag:this.hybridEncTag
      }
    });

    return await modal.present();
  }

async deleteAttachment (fileId) {
    const modal = await this.modalCtrl.create({
      component: DeletePopoverComponent,
      cssClass: 'simple-delete-modal',
      componentProps: { deleteType: 'deleteAttachment', fileId }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.navService.navigateBack();
  }

async revokeAccess (fileid, filename, contactid, tierValue) {
  console.log(fileid, filename, contactid, tierValue);
    const modal = await this.modalCtrl.create({
      component: DeletePopoverComponent,
      cssClass: 'simple-delete-modal',
      componentProps: { deleteType: 'revokeAccess', fileId: fileid, fileName: filename, contactId: contactid, tier: tierValue, index: this.index }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    this.getBeneficiaries();


  }

// async addBeneficiary (fileid, filename) {
//     this.wizardService.name = ''
//     this.wizardService.size = 0;
//     this.wizardService.fileSize = ''
//     this.globalVariablesProvider.addBeneficiaries = true;
//     const modal = await this.modalCtrl.create({
//       component: UploadDocumentComponent,
//       componentProps: { fileId: fileid, fileName: filename }
//     });
//     await modal.present();
//   }



}

