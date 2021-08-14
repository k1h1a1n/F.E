import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController } from '@ionic/angular';
import { SignUpPage } from '../sign-up/sign-up.page';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
})
export class VerifyOtpPage implements OnInit {
  forgotPassForm: FormGroup;


  constructor(
    private navService: NavigationService,
               private formBuilder: FormBuilder,
               private authService: AuthService,
               private popOverCtrl: PopoverController,
               public signup:SignUpPage

  ) { }

  ngOnInit () {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
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

  goBack() {
    this.navService.navigateRoot(['/login']);
  }

  verify(){
    // this.signup.registerAfterOtpVerification()
    this.popOverCtrl.dismiss();

  }


//   async register () {
//     this.navService.navigateRoot('/verify-otp');

//     // const popover = await this.popOverCtrl.create({
//     //     component: VerifyOtpPage,
//     //     cssClass: 'verificatioAdvisor-popover',
//     //     backdropDismiss: false,
//     //     });
//     //   return await popover.present();
//     // this.authService.verifyAdvisorPopOver().then(res => {
//     // })

//     }

// async registerAfterOtpVerification(){
//     console.log("entered code : ",this.enteredCode)
//     if ( this.signUpForm.valid) {
//         Object.keys(this.signUpForm.controls).forEach((key) =>
//         this.signUpForm.get(key).setValue(this.signUpForm.get(key).value.trim()));
//         const loader = await this.loaderCtrl.create({
//             message: 'Please wait...'
//         });
//         (await loader).present();

//         const credentials = {
//             name : this.signUpForm.value.name,
//             email: this.signUpForm.value.email,
//             telephoneNumber: this.selectedCountry.Code + this.signUpForm.value.telephoneNumber ,
//             password: this.signUpForm.value.password,
//             // isUserAnAdvisor: this.checkBoxValue,
//             createdByAdvisor: false

//                   };
//         this.authService.attemptAuth('register', credentials).then(res => {
//                this.loaderCtrl.dismiss();
//             //    if(this.checkBoxValue == true){
//             //     this.verifyAdvisorPopOver();

//             //    }else{
//                 // this.clientPopoverForAdvisorCode();
//                 // this.authService.presentToast('Registration Successfull!');
//                 // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
//                 //  this.navService.navigateRoot('/add-contacts');typeof-user-selection
//                 if (this.FinancialAdvisorbase64Data !== (undefined || null || '') && this.isFinancialAdvisor === true) {
//                     console.log("Yes...Fin Adv")
//                     this.uploadAdvisorDetails();
//                 }else if(this.isHaveCouponCode == true && this.IsAdvisorCode !== (undefined || null || '') ){
//                     this.updateAdvDetailsForUser();
//                 }
//                 this.navService.navigateRoot('/add-contacts');
//             this.authService.userSignedUp = true;

//              //    }
           
//            }).catch(err => {
//                this.loaderCtrl.dismiss();
//             this.authService.userSignedUp = false;

//                this.authService.presentToast('Error in Registering, Please try after sometime');
//            });
//     }
// }    
}
