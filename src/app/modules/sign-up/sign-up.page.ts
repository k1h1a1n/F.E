import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuController, LoadingController, PopoverController, Platform } from '@ionic/angular';
import { NavigationService } from '@durity/services';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GetPhonecodesService } from 'src/app/shared/services/get-phonecodes.service';
import { UploadDocumentsService } from 'src/app/shared/services/upload-documents.service';
import { PopoverForAdvisorVerificationComponent } from 'src/app/shared/components/popover-for-advisor-verification/popover-for-advisor-verification.component';
import { PopoverForClientAdvisorcodeComponent } from 'src/app/shared/components/popover-for-client-advisorcode/popover-for-client-advisorcode.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64';
import { ActionSheetController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ApiService } from 'src/app/services/api.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';





@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.page.html',
    styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage implements OnInit {
    header: HttpHeaders;
    appName = 'Durity';
    countryCodes: { Name: string; ISO: string; Code: string; }[];
    selectedCountry: any;
    signUpForm: FormGroup;
    passwordShown = false;
    passwordType = 'password';
    passwordIcon = 'eye-off';
    uploadImageName = '';
    Question = 'Are you a Financial Advisor?';
    qNo = '1';
    isSignUpMode = false;
    public fileName: any;
    videoId: any;
    fileUrl: string;
    fileDir: string;
    name: any;
    loader: any;
    FinancialAdvisorbase64Data;
    enteredCode;
    btnColor = '#fcfcfc';
    btnColo = 'black';
    questionOneBtn = '#fcfcfc';
    companyNameInput;
    isFinancialAdvisor = false;
    email_not_exist=true;
    isHaveCouponCode = false;
    isQuestion = '1';
    message = 'Please Enter Advisor/Bank Code.';
     isCorrectAdvisor = false;
     time: BehaviorSubject<string>=new BehaviorSubject('00:00');
     interval
  timer: number;
    IsAdvisorCode;
    advsiorDetails:any;
     isDataNotNull = false;
     userDetails:any;
     enableOtp:boolean = false;
     otpForm: FormGroup;
     errorMsg:any = '';
     invalidOTP:boolean = false;
      email :any={};
     labelColor = false
  labelColor2= false;

    constructor (
        private navService: NavigationService,
        private authService: AuthService,
        private codeService: GetPhonecodesService,
        private formBuilder: FormBuilder,
        private UploadDocumentsService: UploadDocumentsService,
        private loaderCtrl: LoadingController,
        private popOverCtrl: PopoverController,
        public menuCtrl: MenuController,
        public camera: Camera,
        public fileChooser: FileChooser,
        private file: File,
        public filePath: FilePath,
        public platform: Platform,
        public apiService: ApiService,
        public loadingCtrl: LoadingController,
        public http: HttpClient,
        private otpformBuilder: FormBuilder

    ) {
        this.header = new HttpHeaders({
            'content-type': 'application/json'
        });
        this.countryCodes = this.codeService.getCountryCodes();
        this.selectedCountry = this.countryCodes[94];
        this.menuCtrl.swipeGesture(false);
        this.signUpForm = this.formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.pattern(String.raw`^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`)
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(6)
            ]],
            name: ['', [
                Validators.required,
                // Validators.pattern(String.raw`^[ +A-Za-z'-]+$`),
                Validators.pattern(String.raw`^[a-zA-Z ]{3,30}$`)
            ]],
            telephoneNumber: ['',  [
                     Validators.required, Validators.maxLength(15),
                     Validators.pattern(String.raw`^[0-9]*$`)
                    //  Validators.pattern(String.raw`^(?:(?:\+|0{0,2})01(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$`)
                 ]],
                 image: [''],
        });
        this.otpForm = this.otpformBuilder.group({
         // otpEntered:['',[Validators.required]]
         otp1:['',[Validators.required,Validators.maxLength(1)]],
         otp2:['',[Validators.required,Validators.maxLength(1)]],
         otp3:['',[Validators.required,Validators.maxLength(1)]],
         otp4:['',[Validators.required,Validators.maxLength(1)]]
        });
        this.authService.currentUser.subscribe((user) => {
            this.userDetails = user
        })
    }

    ngOnInit () {

    }
ionViewWillEnter () {
        this.menuCtrl.swipeGesture(false);
        this.menuCtrl.enable(false);
    }
   onChange (event) {
       this.selectedCountry = event;

   }

   goBack(){
       this.enableOtp = false;
       this.otpForm.reset(); 
   }


   otpController(event,next,prev){
    if(event.target.value.length < 1 && prev){
      prev.setFocus()
    }
    else if(next && event.target.value.length>0){
      next.setFocus();
    }
    else {
     return 0;
    }
  }
//    changeChkBx(value){
//     this.checkBoxValue = !this.checkBoxValue
//    }

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


async register () {
  
  
  let mobNum = {mobileNumber: this.selectedCountry.Code + this.signUpForm.value.telephoneNumber};
  console.log(mobNum)
  this.http.post(`${environment.apiUrl}/user/sendOTPforUserAuth`, mobNum,{ headers: this.header }).subscribe(async (data1) => {
    console.log(data1)
  }), (error: any) => {}; 
  this.startTimer(5);
   this.enableOtp = true;
  }
  

    async makeRegistration() {
      const afterOTPloader = await this.loadingCtrl.create({
        message: 'Verifying OTP...'
    });
    (await afterOTPloader).present();
        // console.log("entered code : ",this.enteredCode)
        let mobNum = {  mobileNumber: this.selectedCountry.Code + this.signUpForm.value.telephoneNumber, otp: this.otpForm.value.otp1+this.otpForm.value.otp2+this.otpForm.value.otp3+this.otpForm.value.otp4 };
        
        this.http.post(`${environment.apiUrl}/user/verifyOTPforUserAuth`, mobNum, { headers: this.header }).subscribe(async (data) => {
        await this.loadingCtrl.dismiss();
        console.log(data);
        console.log(data['status']);
        if (data['response'].message == 'success') {
          if (this.signUpForm.valid) {
            Object.keys(this.signUpForm.controls).forEach((key) => this.signUpForm.get(key).setValue(this.signUpForm.get(key).value.trim()));
            const loader = await this.loaderCtrl.create({
              message: 'Please wait...'
            });
            loader.present();

            const credentials = {
              name: this.signUpForm.value.name,
              email: this.signUpForm.value.email,
              telephoneNumber: this.selectedCountry.Code + this.signUpForm.value.telephoneNumber,
              password: this.signUpForm.value.password,
              // isUserAnAdvisor: this.checkBoxValue,
              createdByAdvisor: false
            };
            this.authService.attemptAuth('register', credentials).then(res => {
              this.loaderCtrl.dismiss();
              this.loaderCtrl.dismiss();

              // loaderCtrl.dismiss();
              //    if(this.checkBoxValue == true){
              //     this.verifyAdvisorPopOver();
              //    }else{
              // this.clientPopoverForAdvisorCode();
              // this.authService.presentToast('Registration Successfull!');
              // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
              //  this.navService.navigateRoot('/add-contacts');typeof-user-selection
              if (this.FinancialAdvisorbase64Data !== (undefined || null || '') && this.isFinancialAdvisor === true) {
                console.log("Yes...Fin Adv");
                this.uploadAdvisorDetails();
              } else if (this.isHaveCouponCode == true && this.IsAdvisorCode !== (undefined || null || '')) {
                this.updateAdvDetailsForUser();
              }
              this.loaderCtrl.dismiss();
              this.navService.navigateRoot('/add-contacts');
              this.authService.userSignedUp = true;

              //    }
            }).catch(err => {
              this.loaderCtrl.dismiss();
              this.authService.userSignedUp = false;

              this.authService.presentToast('Error in Registering, Please try after sometime');
            });
          }
        } else {
          this.loaderCtrl.dismiss();
          this.invalidOTP = true;
          this.errorMsg = "Invalid OTP";

        }
      }, error => {
        if (error.status == 400) {
          this.loaderCtrl.dismiss();
          this.invalidOTP = true;
          this.errorMsg = "Invalid OTP";
        } else {
          this.loaderCtrl.dismiss();
          this.invalidOTP = true;
          this.errorMsg = "Invalid OTP";
        }
      }
      )
    }

    updateAdvDetailsForUser(){
        
        console.log(this.advsiorDetails['profile'])
        let updateAdvisor = {advisorName:this.advsiorDetails['profile'].name,advisorCode:this.advsiorDetails['profile'].advisorCode, advisorUrl:this.advsiorDetails['profile'].advisorUrl,isFinancialAdvisorClient:true}
        this.apiService.put('user/profile', {profile: updateAdvisor}).subscribe(async (data) => {
            console.log("** : ",data)
            this.authService.currentUser.subscribe((user) => {
                this.userDetails.profile.advisorName = this.advsiorDetails['profile'].name
                this.userDetails.profile.advisorCode = this.advsiorDetails['profile'].advisorCode
                this.userDetails.profile.advisorUrl  = this.advsiorDetails['profile'].advisorUrl
                this.userDetails.profile.isFinancialAdvisorClient = true
                

                // console.log("&& : ",user.profile)
                // user.profile = data.profile;
                // console.log("%% : ",user.profile)
                })
        //   this.user.profile = data
        //   this.loader.dismiss()
        //   this.navService.navigateRoot('home')
      
        })
      }

    makeAsFinancialAdvisor(){
        // this.presentAlert('A1004');
      
            
        // this.presentAlert(da);
      }

showPassword () {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';

    }

   async verifyAdvisorPopOver() {
        const popover = await this.popOverCtrl.create({
            component: PopoverForAdvisorVerificationComponent,
            cssClass: 'verificatioAdvisor-popover',
            backdropDismiss: false,
            });
          return await popover.present();
    }

    async clientPopoverForAdvisorCode() {
        const popover = await this.popOverCtrl.create({
            component: PopoverForClientAdvisorcodeComponent,
            cssClass: 'clientAdvisorCode-popover',
            backdropDismiss: false,
            });
          return await popover.present();
    }

    
signUpWithGoogle () {
    }

    moveFocus(nextElement) {
      nextElement.setFocus();
    }   
    

goto (page) {
        switch (page) {
            case 'signIn':
                this.navService.navigateRoot('login');
                break;

            default:
                break;
        }
    }

    userType (ev, qno) {
        if (ev === 'yes' && qno === '1' ) {
            this.Question = 'Are you a Financial Advisor?';
            this.questionOneBtn = 'myblue';
            this.labelColor=true;
            this.isFinancialAdvisor = true;
            this.isHaveCouponCode = false;
            this.isQuestion = qno;
            this.labelColor2=false;
        } else if (ev === 'no' && qno === '1') {
            this.Question = 'Are you a Financial Advisor?';
            this.btnColor = 'white';
            this.questionOneBtn = 'white';
            this.isQuestion = qno;
            this.isFinancialAdvisor = false;
            this.isHaveCouponCode = false;
            this.labelColor=false;
            this.labelColor2=false;
        } else if (ev === 'no' && qno === '2') {
            this.Question = 'Do you have an Advisor/Bank code?';
            this.labelColor=false;
            this.btnColor = 'white';
            this.isQuestion = qno;
            this.isFinancialAdvisor = false;
            this.isHaveCouponCode = false;
            this.labelColor2=false;
            console.log(this.Question);
        } else if (ev === 'yes' && qno === '2') {
            this.Question = 'Do you have an Advisor/Bank code?';
            this.btnColor = 'myblue';
            this.isQuestion = qno;
            this.isFinancialAdvisor = false;
            this.isHaveCouponCode = true;
            this.labelColor=false;
            this.labelColor2=true;
        }
    
    }
    
    changeLogo () {
        this.fileChooser.open()
                      .then(
                          uri => {
                              this.filePath.resolveNativePath(uri)
                                  .then(async (resolveFilePath) => {
                                     this.loader = await this.loadingCtrl.create({
                                      message: 'Uploading...'
                                  });
                                     (await this.loader).present();
                                     this.fileDir = resolveFilePath;
                                     this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                                     this.name = this.fileName;
                                     this.fileUrl = this.fileDir;
                                     let filePathBasedOnOs = this.fileUrl;
                                     const temp = filePathBasedOnOs.split('/');
                                     const imgName = temp.length - 1;
                                     this.uploadImageName = temp[imgName];
                                     this.loader.dismiss();
                                     const nameFile = temp.pop();
                                     filePathBasedOnOs = decodeURI(temp.join('/') + '/');
                                     this.FinancialAdvisorbase64Data = await this.readFileAsBase64Data(filePathBasedOnOs, this.name );
                                    }).catch(err => {} );
                          });
      }
    
      public async readFileAsBase64Data (filePathBasedOnOs, filename) {
        let base4Data;
        await this.file
          .readAsDataURL(filePathBasedOnOs, filename)
          .then((fnBase64Data) => {
            base4Data = fnBase64Data;
          });
        return base4Data;
      }
    
      uploadAdvisorDetails () {

        console.log(this.companyNameInput, "ggggg", this.FinancialAdvisorbase64Data);
        
        const postData = {
          advisorUrl : this.FinancialAdvisorbase64Data,
          advisorLogoName: this.uploadImageName,
          advisorOrgName: this.companyNameInput,
        };
        this.apiService.put('user/profile', {profile: postData}).subscribe(async (data) => {
        });



        // console.log(this.base64OfLogo)
        let updateAdvisor =
         {advisorName:this.signUpForm.value.name,
          isFinancialAdvisor:true,
          email:this.signUpForm.value.email,
          advisorUrl:this.FinancialAdvisorbase64Data,
          advisorLogoName:this.uploadImageName,
          advisorOrgName:this.companyNameInput}
      
            this.apiService.post('user/updateAdvisorCode', {profile: updateAdvisor}).subscribe(async (data) => {
              console.log(data);
              this.userDetails.profile.advisorCode = data.profile.advisorCode
              this.userDetails.profile.advisorName = data.profile.advisorName
              this.userDetails.profile.isFinancialAdvisor = data.profile.isFinancialAdvisor
              
            //   this.authService.currentUser.subscribe((user) => {
            //     this.userDetails.profile = data.profile;
            //   })
              if(this.FinancialAdvisorbase64Data !== (undefined || null || '')){
                this.uploadAdvisorLogo(this.FinancialAdvisorbase64Data,data.profile.advisorCode)
              }
            
            })
      
      }

      uploadAdvisorLogo(base64Data,advcode){
        
 
        let postData = {
          advisorCode : advcode,
          advisorUrl : base64Data,
          advisorLogoName : this.companyNameInput
      
        }
        this.apiService.post('user/uploadAdvisorLogo', { postData}).subscribe(async (data) => {
          console.log(data);
          this.authService.currentUser.subscribe((user) => {
            this.userDetails.profile.advisorLogoName = this.companyNameInput
            this.userDetails.profile.advisorUrl = base64Data
            })
                
          // this.loadingCtrl.dismiss();
          
      
      
      
          // await modal.present();
          }, error => {
            if (error.status === 400) {
            } else {
            }
          });
      }
    
      moveToUploadAgain () {
    
        this.uploadImageName = '';
      }
    
    
    async  verifyAdvisor () {
    console.log('*** : ',this.enteredCode)
        if (this.enteredCode.length > 4) {
            this.isCorrectAdvisor = true;
            const loader = await this.loaderCtrl.create({
                message: 'Please wait...'
            });
            this.http
            .post(`${this.apiService.apiUrl}/user/verifyAdvisorCode`, {
              enteredCode: this.enteredCode,
            }, { headers: this.header })
                .subscribe(data => {
                    if (data !== null) {
                        this.isDataNotNull = false;
                        this.IsAdvisorCode = data['profile'].name;
                        this.advsiorDetails = data;
                        loader.dismiss();
                    } else if (data === null) {
                        this.isDataNotNull = true;
                        loader.dismiss();
                    }
                });
              } else {
                  this.isCorrectAdvisor = false;
              }
          }
}
