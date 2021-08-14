import { NavigationService } from './../../services/navigation.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MenuController, LoadingController, PopoverController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { GetPhonecodesService } from '../../services/get-phonecodes.service';
@Component({
  selector: 'app-google-sign-up',
  templateUrl: './google-sign-up.component.html',
  styleUrls: ['./google-sign-up.component.scss'],
})
export class GoogleSignUpComponent implements OnInit {
  countryCodes: { Name: string; ISO: string; Code: string; }[];

  otpForm: FormGroup;
  validateOtpForm: FormGroup;
  header: HttpHeaders;
  btnColor: 'medium';
  btnColo: 'medium';
  user: any;
  formScreen: number = 1;
  timer: number;
  interval: any;
  time: BehaviorSubject<string>=new BehaviorSubject('00:00');
  errorMsg: any = '';
  invalidOTP: boolean = false;
  resendNumber: any;
  show: boolean = false;
  selectedCountry: any;
  constructor(public navService: NavigationService, public authService: AuthService,
              public otpformBuilder: FormBuilder, public otpformBuilder2: FormBuilder,
              public http: HttpClient, public loadingCtrl: LoadingController, private codeService: GetPhonecodesService,public loaderCtrl: LoadingController,) {
    this.otpForm = this.otpformBuilder.group(
    {
      phoneNoEntered: ['', [ Validators.required, Validators.maxLength(15),
        Validators.pattern(String.raw`^[0-9]*$`)]]
    });
    this.countryCodes = this.codeService.getCountryCodes();
        this.selectedCountry = this.countryCodes[94];
    this.validateOtpForm = this.otpformBuilder2.group({
      // otpEntered: ['', [Validators.required]]
      otp1:['',[Validators.required,Validators.maxLength(1)]],
      otp2:['',[Validators.required,Validators.maxLength(1)]],
      otp3:['',[Validators.required,Validators.maxLength(1)]],
      otp4:['',[Validators.required,Validators.maxLength(1)]]
    });
    this.header = new HttpHeaders({
      'content-type': 'application/json'
  });

  }

  ngOnInit () {}


  onChange (event) {
    this.selectedCountry = event;

}
  goBack () {
    if ( this.formScreen === 1) {
      this.navService.navigateBack();
    } else {
      this.formScreen = 1;
    }
  }
  startTimer (duration: number){
    clearInterval(this.interval);
    this.timer = duration * 60;
    this.updateTimeValue();
    //this.stopTimer();
    this.interval = setInterval(() => {
      this.updateTimeValue();
    }, 1000);
    this.interval = setInterval(() => {
      if (this.timer <= 0 ) {
        this.stopTimer();
        this.show = true;
      }
    }, 1000);
    // console.log(this.timer);
  }
  updateTimeValue () {
    let minutes: any = this.timer / 60;
    let seconds: any = this.timer % 60;
  
    minutes = String('0' + Math.floor(minutes)).slice(-2);
    seconds = String('0' + Math.floor(seconds)).slice(-2);
  
    const text = minutes + ':' + seconds;
    this.time.next(text);
    --this.timer;
  }
  stopTimer () {
    clearInterval(this.timer);
    this.time.next('00:00');
  }
  otpPage () {
    const mobNum = {mobileNumber: this.otpForm.value.phoneNoEntered};
    this.resendNumber = this.otpForm.value.phoneNoEntered;
    this.http.post(`${environment.apiUrl}/user/sendOTPforUserAuth`, mobNum, { headers: this.header }).subscribe(async (data1) => {
    });
    this.startTimer(5);
    this.formScreen = this.formScreen + 1;
  }

  getUser () {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
     
    });
  }

  resend() {
    this.show = false;
    const mobNum = {mobileNumber: this.resendNumber};
    this.stopTimer();
    this.startTimer(5);
    this.http.post(`${environment.apiUrl}/user/sendOTPforUserAuth`, mobNum, { headers: this.header }).subscribe(async (data) => {
    });
  }
  async validateOtp () {
    const mobNum = { mobileNumber: this.otpForm.value.phoneNoEntered, otp: this.validateOtpForm.value.otp1 + this.validateOtpForm.value.otp2 + this.validateOtpForm.value.otp3 + this.validateOtpForm.value.otp4 };
    const afterOTPloader = await this.loadingCtrl.create({
      message: 'Verifying OTP...'
    });
    (await afterOTPloader).present();
    this.http.post(`${environment.apiUrl}/user/verifyOTPforUserAuth`, mobNum , { headers: this.header }).subscribe(async (data) => {
      await this.loadingCtrl.dismiss();
      // if(data['response'].message === 'success') {
      if( data['response'].message === 'success' ) {
        this.updateMobileNum(this.otpForm.value.phoneNoEntered)
        this.navService.navigateForword('/typeof-user-selection');
      }
    }, error => {
       if (error.status === 400) {
        this.loadingCtrl.dismiss();
        this.invalidOTP = true;
        this.errorMsg = 'Invalid OTP';
       }
      }
    );
  }

  async updateMobileNum(mob){
    let data = {'email':this.user.email, 'mobile':mob}
    this.http.post(`${environment.apiUrl}/user/updateMobNum`, data , { headers: this.header }).subscribe(async (data) => {

    })

  }




  moveFocus(nextElement) {
    nextElement.setFocus();
  }   



}
