import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { PopoverController, NavParams, NavController, LoadingController, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DownloadDocumentService } from '../../services/download-document.service';
import { EncryptAndDecryptService } from "src/app/shared/services/encrypt-and-decrypt.service";
import { UploadDocumentsService } from '../../services/upload-documents.service';
import * as hash from 'hash.js';
import * as  forge from 'node-forge';

declare var window: any;


@Component({
  selector: 'app-enter-otpand-decrypt-file',
  templateUrl: './enter-otpand-decrypt-file.component.html',
  styleUrls: ['./enter-otpand-decrypt-file.component.scss'],
})
export class EnterOTPandDecryptFileComponent implements OnInit {

  user;
  otpForm: FormGroup;
  userpwdForDec: FormGroup;
  passwordKey: any;
  passwordType = 'password';
  passwordIcon = 'eye-off';
  isVerified: boolean;
  hybridEncTag:any;
  anotherAttempt: string = "";
  hashValue:any;
  keyIIvforBothEnc:any;
  keyNIvforUserKey:any;
  configuration: any;
  enteredPasswordHash:any;
  userFileEncIv: any;
  userFileEncTag: any;
  isBiometricPressed:boolean = false;
  //otp:String="";
  time: BehaviorSubject<string>=new BehaviorSubject('00:00');
  timer: number; //in seconds
  interval
  fileId;
  fileName
  keyNIv: any;
  salt:any;
  fileUrl: any;
  isBiometricEnabled: boolean;
  isUserEncWithPassword: boolean;
  disableDownloadBtn:boolean= true;
  incorrectKey:boolean = false;
  isOTPverified:boolean;
  telephoneNumber
  constructor(public navService: NavigationService,
              public popOverCtrl: PopoverController,
              private authService: AuthService,
              private apiService: ApiService,
              private formBuilder: FormBuilder,
              private formBuilderForUsrPwd: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              private EncryptAndDecryptService: EncryptAndDecryptService,
              private uploadDocumentsService: UploadDocumentsService,
              private downloadDcoumentService: DownloadDocumentService,
              private downloadDocumentService: DownloadDocumentService,
              private navParams: NavParams,
              private navCtrl: NavController
    ) {
      this.fileId = navParams.get('fileId');
      this.fileName=navParams.get('filename');
      this.telephoneNumber=navParams.get('telephoneNumber');
      this.isBiometricEnabled=navParams.get('isBiometricEnabled');
      this.isUserEncWithPassword = navParams.get('isUserEncrypted');
      this.fileUrl = navParams.get('fileUrl');
      this.userFileEncIv = navParams.get('userFileEncIv'),
      this.userFileEncTag = navParams.get('userFileEncTag'),
      this.hybridEncTag = navParams.get('hybridEncTag');
      this.authService.currentUser.subscribe((info) => {
        this.configuration = info.configuration;
        if (this.configuration.userEncryption.passwordHash === undefined || null) {
             this.hashValue = null;
         } else {
             this.hashValue = this.configuration.userEncryption.passwordHash;
             this.salt = this.configuration.userEncryption.salt;
         }

     });
      // if(this.passwordKey==undefined || this.passwordKey==""){
      //   this.disableDownloadBtn = !this.disableDownloadBtn;
      //  }
    //   this.authService.currentUser.subscribe((user) => {
    //   this.user = user;
    // }); 
  }

    ngOnInit() {
      this.startTimer(5);
      this.otpForm = this.formBuilder.group({
       otp : ['', [Validators.required] ],
        
      });
     
    }

  startTimer(duration: number){
    clearInterval(this.interval);
    this.timer = duration*60;
    this.updateTimeValue();
    this.interval=setInterval(()=>{
      this.updateTimeValue();
    },1000);
    }

  stopTimer(){
    clearInterval(this.interval);
    this.time.next('00:00');
  }


  updateTimeValue() {
    let minutes: any = this.timer /60;
    let seconds: any= this.timer %60;

    minutes= String('0'+Math.floor(minutes)).slice(-2);
    seconds= String('0'+Math.floor(seconds)).slice(-2);

    const text=minutes+ ':'+ seconds;
    this.time.next(text);

    --this.timer;
  }

  private generateHash (encryptionKey: any): any {
    if(this.salt != (undefined || null)){
      return hash.sha256().update(encryptionKey+this.salt).digest('hex');

    }else{
      return hash.sha256().update(encryptionKey).digest('hex');

    }
    
}

public generateSalt() {
  return forge.util.encode64(forge.random.getBytesSync(16));
}

async presentAlert () {
  const alert = await this.alertCtrl.create({
      message: 'Please enter valid encryption password.',
      buttons: ['OK']
  });
  await alert.present();
}

  download(){
    if(this.isBiometricEnabled==true && this.isUserEncWithPassword==true){
      if(this.isBiometricPressed == true){
        this.downloadAfterOtpVerificationWhenBothBiometric(this.fileUrl,this.keyIIvforBothEnc,this.fileName,this.fileId);
      }else{

        if(this.passwordKey==undefined || this.passwordKey==""){
          this.authService.presentToast("Please enter password");
        }else{
          var PadString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let copyOfUsrPwd = this.passwordKey;
          let enteredPasswordPad = copyOfUsrPwd.padStart(16,PadString);
          this.enteredPasswordHash = this.generateHash (enteredPasswordPad);
          if (this.hashValue === this.enteredPasswordHash) {
           
        var res = this.EncryptAndDecryptService.decrypt(this.keyIIvforBothEnc['hybridEncKeyForUserKey'],enteredPasswordPad, this.userFileEncIv,this.userFileEncTag,false)
               
        this.uploadDocumentsService.decryptFile(this.fileUrl, res,this.keyIIvforBothEnc['hybridEncIvForUserIv'],this.hybridEncTag, this.fileName, true, false);
  
          }else {
            this.incorrectKey = true;
        }
          
        }

      }
      var PadString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let copyOfUsrPwd = this.passwordKey;
      let enteredPasswordPad = copyOfUsrPwd.padStart(16,PadString);
      this.enteredPasswordHash = this.generateHash (enteredPasswordPad);
      if (this.hashValue === this.enteredPasswordHash) {
       
    var res = this.EncryptAndDecryptService.decrypt(this.keyNIv['hybridEncKey'],enteredPasswordPad, this.userFileEncIv,this.userFileEncTag,false)
           
    this.uploadDocumentsService.decryptFile(this.fileUrl, res,this.keyNIv['hybridEncIv'],this.hybridEncTag, this.fileName, true, false);

      }else {
        this.incorrectKey = true;
        // this.presentAlert();
    }


    }else if(this.isBiometricEnabled==true){

      this.downloadAfterOtpVerification(this.fileUrl,this.keyNIv,this.fileName,this.fileId)

    }else if(this.isUserEncWithPassword==true){
      if(this.passwordKey==undefined || this.passwordKey==""){
        this.authService.presentToast("Please enter password");
      }else{
        var PadString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let copyOfUsrPwd = this.passwordKey;
        let enteredPasswordPad = copyOfUsrPwd.padStart(16,PadString);
        this.enteredPasswordHash = this.generateHash (enteredPasswordPad);
        if (this.hashValue === this.enteredPasswordHash) {
         
      var res = this.EncryptAndDecryptService.decrypt(this.keyNIv['hybridEncKey'],enteredPasswordPad, this.userFileEncIv,this.userFileEncTag,false)
             
      this.uploadDocumentsService.decryptFile(this.fileUrl, res,this.keyNIv['hybridEncIv'],this.hybridEncTag, this.fileName, true, false);

        }else {
          this.incorrectKey = true;
      }
        
      }

    }else{
      this.downloadAfterOtpVerification(this.fileUrl,this.keyNIv,this.fileName,this.fileId)
    }
  }

  

  public async downloadAfterOtpVerification (data,keyNiv,filename,documentId) {
     
    this.uploadDocumentsService.decryptFile(data, keyNiv['hybridEncKey'], keyNiv['hybridEncIv'], this.hybridEncTag, '', false)
    .then((ext) => {
      // this.fileExtension = ext;
      this.loadingCtrl.dismiss();
      // if (this.fileExtension.substring(this.fileExtension.lastIndexOf('.') + 1) !== 'encrypt') {
        this.downloadDocumentService.downloadSuccessAlert(filename);
        this.downloadDocumentService.pushNotificationToStatusBar(data, filename);
        this.popOverCtrl.dismiss();
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


  public async downloadAfterOtpVerificationWhenBothBiometric (data,keyNiv,filename,documentId) {
     
    this.uploadDocumentsService.decryptFile(data, keyNiv['hybridEncKeyForBiometric'], keyNiv['hybridEncIvForBiometric'], this.hybridEncTag, '', false)
    .then((ext) => {
      // this.fileExtension = ext;
      this.loadingCtrl.dismiss();
      // if (this.fileExtension.substring(this.fileExtension.lastIndexOf('.') + 1) !== 'encrypt') {
        this.downloadDocumentService.downloadSuccessAlert(filename);
        this.downloadDocumentService.pushNotificationToStatusBar(data, filename);
        this.popOverCtrl.dismiss();
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


  async verify() {

    this.userpwdForDec =  this.formBuilder.group({
      userpwd : ['', [Validators.required] ],
     });
    await this.apiService.post('user/verifyOTPandGetKeysById', { fileId: this.fileId, mobileNumber: this.telephoneNumber, otp: this.otpForm.value.otp }).subscribe(async (data) => {
      if(this.isBiometricEnabled == true && this.isUserEncWithPassword == true){
        this.isOTPverified = true;

        // console.log(data);
         this.keyIIvforBothEnc = data;
        // this.keyNIv = data;
        this.disableDownloadBtn = !this.disableDownloadBtn;
        // else if(this.isBiometricEnabled == true && this.isUserEncWithPassword == true){
          // this.disableDownloadBtn = !this.disableDownloadBtn;

          this.biometricDecryptWhenBothEnc(this.keyIIvforBothEnc);

        // }

      }else if (data.hybridEncKey && data.hybridEncIv) {
        this.isOTPverified = true;
        this.keyNIv = data;
        if(this.isBiometricEnabled== false && this.isUserEncWithPassword==false){
          this.disableDownloadBtn = !this.disableDownloadBtn;
        }else if(this.isUserEncWithPassword == true && this.isBiometricEnabled == false){
          this.disableDownloadBtn = !this.disableDownloadBtn;
        }
       
        if(this.isBiometricEnabled == true && this.isUserEncWithPassword == false){
          this.biometricDecrypt(this.keyNIv);
        }
      }
      else {
        this.isOTPverified = false;
        this.authService.presentToast("Incorrect OTP!");
      }

    }, (error: any) => {
      this.isOTPverified = false;
      this.authService.presentToast("Incorrect OTP!");
      return error;
    })
  }

  biometricDecrypt(keyNIv){
    window.cordova.plugins.CustomBiometricPlugin.decryptAfterBiometric(
      keyNIv['hybridEncKey'], "mdurity",
      (res) => {
        // this.alert.message = '<ion-icon name="checkmark-circle"></ion-icon>';
        // this.biometricDecryptKey = res;
        keyNIv['hybridEncKey'] = res;
        this.disableDownloadBtn = !this.disableDownloadBtn;
        document.querySelector('body');
        this.alertCtrl.dismiss();
       
        // return res;
      },
      (e) =>{
        this.anotherAttempt = "Try Again";
        this.biometricDecrypt(this.keyNIv)
      }
    )
  }

  biometricDecryptWhenBothEnc(keyNIv){
    window.cordova.plugins.CustomBiometricPlugin.decryptAfterBiometric(
      keyNIv['hybridEncKeyForBiometric'], "mdurity",
      (res) => {
        this.isBiometricPressed = true;
        // this.alert.message = '<ion-icon name="checkmark-circle"></ion-icon>';
        // this.biometricDecryptKey = res;
        keyNIv['hybridEncKeyForBiometric'] = res;
        // this.disableDownloadBtn = !this.disableDownloadBtn;
        document.querySelector('body');
        this.alertCtrl.dismiss();
       
        // return res;
      },
      (e) =>{
        this.anotherAttempt = "Try Again";
        this.biometricDecrypt(this.keyNIv)
      }
    )
  }

  resendOtp() {
    this.stopTimer();

    this.apiService.post('user/resendOTP', { mobileNumber: this.telephoneNumber }).subscribe((data) => {
      this.startTimer(5);

    }, (error) => {
      console.log(error);
    });

  }

goBack(){
  this.stopTimer();
  this.popOverCtrl.dismiss();
}

showPassword(){
  this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';

  

}

 



}
