
import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../../services/navigation.service";
import {
  PopoverController,
  NavParams,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { SignupWizardService } from "../../services/signup-wizard.service";
import { AuthService } from "src/app/services/auth.service";
import { UploadDocumentsService } from "../../services/upload-documents.service";
import { DownloadDocumentService } from "../../services/download-document.service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { EncryptAndDecryptService } from "src/app/shared/services/encrypt-and-decrypt.service";
import { environment } from "src/environments/environment";
import * as hash from "hash.js";
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import * as  forge from 'node-forge';
import { AboutAdvanceEncryptionComponent } from '../about-advance-encryption/about-advance-encryption.component';

declare var window: any;
declare var device: any;

@Component({
  selector: "app-user-encryption-options",
  templateUrl: "./user-encryption-options.component.html",
  styleUrls: ["./user-encryption-options.component.scss"],
})
export class UserEncryptionOptionsComponent implements OnInit {
  fingerprintIsChecked: boolean = false ;
  passwordIsChecked: boolean = false ;
  disableUploadBtn: boolean = false;
  isUserEncryptionEnabled: any;
  // abc:boolean = true;
  // xyz:boolean = false;

  apiUrl: string = environment.apiUrl;
  documentType: string;
  private flagType;
  fileName: string;
  biometricKey: any;
  fileUrl: string;
  fileId: string;
   passwordKey: string = "";
  private savedFile: string;
  textNoteData: any;
  private userId: string;
  token: string;
  warningForWrongPassword: any = "";
  header: HttpHeaders;
  configuration: any;
  hybridEncTag: any;
  passwordType = "password";
  passwordIcon = "eye-off";
  keyNIV: any;
  userFileEncIv: string;
  userFileEncTag: string;
  hashValue: any;
  salt: any;
  isFingerprintActivatedInDevice: boolean = true;
  enteredPasswordHash: any;
  subscription: any;
  isAdvisorUpload: boolean = false;
  advisorAccess: boolean = true;
  public unregisterBackButtonAction: any;
  isFinAdv: boolean = false;

  constructor(
    private authService: AuthService,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private downloadDocumentService: DownloadDocumentService,
    private EncryptAndDecryptService: EncryptAndDecryptService,
    public navService: NavigationService,
    private navParams: NavParams,
    public popOverCtrl: PopoverController,
    private uploadDocumentsService: UploadDocumentsService,
    private wizardService: SignupWizardService,
    private http: HttpClient,
    public globalVariablesProvider: GlobalVariablesService,

  ) {
    this.navService.registerHomeBackButtonExit();

    this.authService.currentUser.subscribe((info) => {
      console.log("##### : ",this.globalVariablesProvider.isUserAclient,info.profile.isFinancialAdvisor);
      this.isFinAdv = info.profile.isFinancialAdvisor;
      if(this.isFinAdv == true){
        this.isFinAdv = info.profile.isFinancialAdvisor;
        this.isAdvisorUpload = this.globalVariablesProvider.isUserAclient;
      }
      
      this.configuration = info.configuration;
      if (this.configuration.userEncryption.passwordHash === undefined || null) {
           this.hashValue = null;
           this.salt = null;
       } else {
          if(this.configuration.userEncryption.salt == undefined || null){
            this.salt = null
          }else{
            this.salt = this.configuration.userEncryption.salt
          }
           this.hashValue = this.configuration.userEncryption.passwordHash;
       }

   });

    // this.authService.configuration.subscribe((info) => {
    //   this.configuration = info;
    //   if (this.configuration.userEncryptionHash === undefined || null) {
    //     this.hashValue = null;
    //   } else {
    //     this.hashValue = this.configuration.userEncryptionHash;
    //   }
    // });

    this.flagType = navParams.get("flagType");
    this.keyNIV = navParams.get("keyNIV");
    this.isUserEncryptionEnabled = navParams.get("isUserEncryptionEnabled");
    this.userFileEncIv = navParams.get("userFileEncIv");
    this.userFileEncTag = navParams.get("userFileEncTag");
    this.advisorAccess = navParams.get("advisorAccess");
    this.authService.currentUser.subscribe((user) => {
      this.userId = user._id;
      this.token = user.token;
      this.header = new HttpHeaders({
        "content-type": "application/json",
        Authorization: this.token,
      });
    });

    this.fileName = this.navParams.get("fileName");
    this.fileUrl = this.navParams.get("fileUrl");
    this.documentType = this.navParams.get("documentType");
    this.textNoteData = this.navParams.get("textNoteData");
    this.fileId = this.navParams.get("fileId");
    this.hybridEncTag = this.navParams.get("hybridEncTag");
    console.log("%%%%%%%%%%%");
    this.generateBiometricPublicKey();
    if(this.isFingerprintActivatedInDevice == false){
      this.authService.presentToast("No Fingerprints detected in this Device");
    }
  }

  ngOnInit() {}

  goBack() {
    this.popOverCtrl.dismiss();
  }

  bioMetricEnc() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("I promise to return after half a second!");
      }, 500);
    });
  }

 public generateSalt() {
  return forge.util.encode64(forge.random.getBytesSync(16));
}

  private generateHash(encryptionKey: any): any {
    if(this.hashValue !== (null || undefined)){
      if(this.salt == (undefined || null)){
        
        return hash.sha256().update(encryptionKey).digest("hex");
      }else{
       
      return hash.sha256().update(encryptionKey+this.salt).digest("hex");
      }
    }else{
      const salt=  this.generateSalt();
      console.log("generated salt : ", salt)
      console.log("Hash for 1234 : ","d07e84405c96e3aa2aac50611b8fcb62a74f7aa51aa9bd04ef08aae06741378b")
      return hash.sha256().update(encryptionKey+salt).digest("hex");
    }
    
  }

  uploadButtonDisable(isFingerPrintChecked: boolean, isPasswordChecked: boolean){
    // console.log(this.fingerprintIsChecked+":"+this.passwordIsChecked);
    if(this.fingerprintIsChecked == false && this.passwordIsChecked == false){
      this.disableUploadBtn = false;
    }else {
      this.disableUploadBtn = true;

    }
  }

  upload(isFingerPrintChecked: boolean, isPasswordChecked: boolean) {
    if(this.isFingerprintActivatedInDevice == false){
      this.authService.presentToast("No Fingerprints detected in this Device");

    }else if (isFingerPrintChecked == true && isPasswordChecked == true) {
      console.log("both");

      var PadString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let copyOfUsrPwd = this.passwordKey;
      let pwdKeyPadded = copyOfUsrPwd.padStart(16, PadString);
      this.enteredPasswordHash = this.generateHash(pwdKeyPadded);
      console.log("entered key : ",pwdKeyPadded)
     
      console.log("hashed key with salt : ",this.enteredPasswordHash)
      
      if(this.passwordKey== undefined || this.passwordKey == ""){
        this.warningForWrongPassword = "Please enter password";
      }else if (this.documentType === "document") {
        if (
          this.isUserEncryptionEnabled === true &&
          this.hashValue === (null || undefined)
        ) {
          this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(
            true,
            pwdKeyPadded,
            this.advisorAccess,
            "sign-up",
            this.fileName,
            true
          );
          // this.bioMetricEnc().then((val)=>{
          //   this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(
          //     false,
          //     "",
          //     "log-in",
          //     this.fileName,
          //     true
          //   );
          // })
         
        } else if (
          this.isUserEncryptionEnabled === false ||
          (this.isUserEncryptionEnabled === true &&
            this.hashValue !== (null || undefined))
        ) {
          console.log(this.enteredPasswordHash);
          if (this.hashValue === this.enteredPasswordHash) {
            this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(
              true,
              pwdKeyPadded,
              this.advisorAccess,
              "log-in",
              this.fileName,
              true
            );
            // this.bioMetricEnc().then((val)=>{

            // this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(
            //   false,
            //   "",
            //   "log-in",
            //   this.fileName,
            //   true
            // );
            // })
          } else {
            this.warningForWrongPassword =
              "The hash of the password that you entered does not match the hash of the password you previously used. Please make sure you remember the password and keep it safe as you cannot decrypt or download any files that have been encrypted using this password. Since we do not store passwords, we cannot help you in case you lose it.";
          }
        }
      } else if (this.documentType === "text-note") {
        if (
          this.isUserEncryptionEnabled === true &&
          this.hashValue === (null || undefined)
        ) {
          // this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(true, pwdKeyPadded, 'sign-up', this.fileName);
          this.uploadDocumentsService.uploadTextNote(
            true,
            pwdKeyPadded,
            this.advisorAccess,
            "sign-up",
            this.fileName,
            this.textNoteData,
            true
          );
          // this.bioMetricEnc().then((val)=>{

          // this.uploadDocumentsService.uploadTextNote(
          //   false,
          //   "",
          //   "log-in",
          //   this.fileName,
          //   this.textNoteData,
          //   true
          // );
          // })
        } else if (
          this.isUserEncryptionEnabled === false ||
          (this.isUserEncryptionEnabled === true &&
            this.hashValue !== (null || undefined))
        ) {
          if (this.hashValue === this.enteredPasswordHash) {
            this.uploadDocumentsService.uploadTextNote(
              true,
              pwdKeyPadded,
              this.advisorAccess,
              "log-in",
              this.fileName,
              this.textNoteData,
              true
            );
            // this.bioMetricEnc().then((val)=>{

            // this.uploadDocumentsService.uploadTextNote(
            //   false,
            //   "",
            //   "log-in",
            //   this.fileName,
            //   this.textNoteData,
            //   true
            // );
            // })
          } else {
            this.warningForWrongPassword =
              "The hash of the password that you entered does not match the hash of the password you previously used. Please make sure you remember the password and keep it safe as you cannot decrypt or download any files that have been encrypted using this password. Since we do not store passwords, we cannot help you in case you lose it.";
          }
        }
      }









    } else if (isFingerPrintChecked == true) {

      if (this.documentType === "document") {
      this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(
        false,
        "",
        this.advisorAccess,
        "log-in",
        this.fileName,
        true
      );
      }else if(this.documentType === "text-note"){
        this.uploadDocumentsService.uploadTextNote(
          false,
          "",
          this.advisorAccess,
          "log-in",
          this.fileName,
          this.textNoteData,
          true
        );

      }
    } else {

      // console.log(this.passwordKey);
      var PadString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let copyOfUsrPwd = this.passwordKey;
      let pwdKeyPadded = copyOfUsrPwd.padStart(16, PadString);
      this.enteredPasswordHash = this.generateHash(pwdKeyPadded);
      console.log("entered key : ",pwdKeyPadded)
     
      console.log("hashed key with salt : ",this.enteredPasswordHash)
      
      if(this.passwordKey== undefined || this.passwordKey == ""){
        this.warningForWrongPassword = "Please enter password";
      }else if (this.documentType === "document") {
        if (
          this.isUserEncryptionEnabled === true &&
          this.hashValue === (null || undefined)
        ) {
          this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(
            true,
            pwdKeyPadded,
            this.advisorAccess,
            "sign-up",
            this.fileName
          );
        } else if (
          this.isUserEncryptionEnabled === false ||
          (this.isUserEncryptionEnabled === true &&
            this.hashValue !== (null || undefined))
        ) {
          console.log(this.enteredPasswordHash);
          if (this.hashValue === this.enteredPasswordHash) {
            this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(
              true,
              pwdKeyPadded,
              this.advisorAccess,
              "log-in",
              this.fileName
            );
          } else {
            this.warningForWrongPassword =
              "The hash of the password that you entered does not match the hash of the password you previously used. Please make sure you remember the password and keep it safe as you cannot decrypt or download any files that have been encrypted using this password. Since we do not store passwords, we cannot help you in case you lose it.";
          }
        }
      } else if (this.documentType === "text-note") {
        if (
          this.isUserEncryptionEnabled === true &&
          this.hashValue === (null || undefined)
        ) {
          // this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(true, pwdKeyPadded, 'sign-up', this.fileName);
          this.uploadDocumentsService.uploadTextNote(
            true,
            pwdKeyPadded,
            this.advisorAccess,
            "sign-up",
            this.fileName,
            this.textNoteData,
            false
          );
        } else if (
          this.isUserEncryptionEnabled === false ||
          (this.isUserEncryptionEnabled === true &&
            this.hashValue !== (null || undefined))
        ) {
          if (this.hashValue === this.enteredPasswordHash) {
            this.uploadDocumentsService.uploadTextNote(
              true,
              pwdKeyPadded,
              this.advisorAccess,
              "log-in",
              this.fileName,
              this.textNoteData,
              false
            );
          } else {
            this.warningForWrongPassword =
              "The hash of the password that you entered does not match the hash of the password you previously used. Please make sure you remember the password and keep it safe as you cannot decrypt or download any files that have been encrypted using this password. Since we do not store passwords, we cannot help you in case you lose it.";
          }
        }
      }
    }
    // this.navService.navigateForword('/upload-document');
  }

  showPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }

  async aboutAdvanceEncryption() {
    console.log("HHHHHHHHHHHHHHHHHHHHHHHHH")
    const popover = await this.popOverCtrl.create({
      component: AboutAdvanceEncryptionComponent,
      // translucent: true,
      // backdropDismiss: false,
      cssClass: 'custom-popoverEncryption'
    });
      return await popover.present();
  }

  fingerPrint(e): void {
    let isChecked = e.currentTarget.checked;
    
    if (this.passwordIsChecked != false) {
      this.disableUploadBtn = !this.disableUploadBtn;
    }
    this.fingerprintIsChecked = isChecked;
    // if(this.fingerprintIsChecked == false){
    //   this.passwordIsChecked == true;
    // }
    // this.xyz = this.fingerprintIsChecked
    console.log(this.fingerprintIsChecked)
  }

  generateBiometricPublicKey() {
    window.cordova.plugins.CustomBiometricPlugin.generatePublicKey(1024, "mdurity",
      (res) => {
          this.biometricKey = res;
      },
      (err) =>{
        this.isFingerprintActivatedInDevice = false;
        console.log(err);
        return err} 
    );
  }

// async addDeviceToBiometric(){
    
   
//     var userDeviceDetails = {
//         operatingSystem: device.platform,
//         UUID: device.uuid,
//         keyStoreId: 'mdurity',
//         deviceType: 'mobile',
//         publicKeyId: this.biometricKey,
//         userId: this.userDetails._id,
//         encRandKey: '',
//         encRandIv: ''
//     }
    
//     this.UploadDocumentsService.addDevicForBiometric(userDeviceDetails);
// }

  password(e): void {
    // console.log(e);

    let isChecked = e.currentTarget.checked;
    
    
    if (this.fingerprintIsChecked != false) {
      this.disableUploadBtn = !this.disableUploadBtn;
    }
    this.passwordIsChecked = isChecked;
    // if(this.passwordIsChecked == false){
    //   this.fingerprintIsChecked == true;
    // }
    // this.abc = this.passwordIsChecked
    console.log(this.passwordIsChecked)
  }
}
