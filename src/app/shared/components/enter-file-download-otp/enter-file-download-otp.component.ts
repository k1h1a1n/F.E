import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { PopoverController, NavParams, NavController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DownloadDocumentService } from '../../services/download-document.service';

@Component({
  selector: 'app-enter-file-download-otp',
  templateUrl: './enter-file-download-otp.component.html',
  styleUrls: ['./enter-file-download-otp.component.scss'],
})
export class WillDisclaimerComponent implements OnInit {
  user;
  otpForm: FormGroup;
  isVerified: boolean;
  //otp:String="";
  time: BehaviorSubject<string>=new BehaviorSubject('00:00');
  timer: number; //in seconds
  interval
  fileId;
  fileName
  keyNIv: any;
  telephoneNumber
  constructor(public navService: NavigationService,
              public popOverCtrl: PopoverController,
              private authService: AuthService,
              private apiService: ApiService,
              private formBuilder: FormBuilder,
              private downloadDcoumentService: DownloadDocumentService,
              private navParams: NavParams,
              private navCtrl: NavController
    ) {
      this.fileId = navParams.get('fileId');
      this.fileName=navParams.get('filename');
      this.telephoneNumber=navParams.get('telephoneNumber');
    //   this.authService.currentUser.subscribe((user) => {
    //   this.user = user;
    // }); 
  }

    ngOnInit() {
      // this.startTimer(5);
      this.otpForm = this.formBuilder.group({
       otp : ['', [Validators.required] ],
        
      });
    }

  // startTimer(duration: number){
  //   clearInterval(this.interval);
  //   this.timer = duration*60;
  //   this.updateTimeValue();
  //   this.interval=setInterval(()=>{
  //     //console.log(this.time);
  //     this.updateTimeValue();
  //   },1000);
  //   }

  // stopTimer(){
  //   clearInterval(this.interval);
  //   this.time.next('00:00');
  // }


  // updateTimeValue() {
  //   let minutes: any = this.timer /60;
  //   let seconds: any= this.timer %60;

  //   minutes= String('0'+Math.floor(minutes)).slice(-2);
  //   seconds= String('0'+Math.floor(seconds)).slice(-2);

  //   const text=minutes+ ':'+ seconds;
  //   this.time.next(text);

  //   --this.timer;
  // }
  



  // async verify() {

  //   await this.apiService.post('user/verifyOTPandGetKeysById', { fileId: this.fileId, mobileNumber: this.telephoneNumber, otp: this.otpForm.value.otp }).subscribe(async (data) => {
  //     if (data.hybridEncKey && data.hybridEncIv) {
  //       this.isVerified = true;
  //       this.keyNIv = data;
  //       // await this.downloadDcoumentService.presentSpinner('Download in Progress...');
  //       this.popOverCtrl.dismiss(this.keyNIv)
  //     }
  //     else {
  //       this.isVerified = false;
  //       this.authService.presentToast("Incorrect OTP!");
  //     }

  //   }, (error: any) => {
  //     this.isVerified = false;

  //     this.authService.presentToast("Incorrect OTP!");
  //     return error;
  //   })
  // }

  // resendOtp() {
  //   this.stopTimer();

  //   this.apiService.post('user/resendOTP', { mobileNumber: this.user.profile.telephoneNumber }).subscribe((data) => {
  //     this.startTimer(5);

  //   }, (error) => {
  //     console.log(error);
  //   });

  // }

  ok(){
    this.popOverCtrl.dismiss();
  }
goBack(){
  // this.stopTimer();
  this.popOverCtrl.dismiss();
  this.navService.navigateBack();
}

 

}
