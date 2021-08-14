import { Component} from '@angular/core';
import { NavigationService } from '@durity/services';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { SecureStorageObject } from '@ionic-native/secure-storage/ngx';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
    loginForm: FormGroup;
    passlength: number;
    addedExtraSecurityStatus: boolean;
    signupProcessCompleted: boolean;
    userId: string;
    password = true;

    constructor (
        private storage: Storage,
        private alertCtrl: AlertController,
        private navService: NavigationService,
        private authService: AuthService,
        public formBuilder: FormBuilder,
        private googlePlus: GooglePlus,
        public menuCtrl: MenuController,
        public loaderCtrl: LoadingController,
        private globalVariablesProvider: GlobalVariablesService
    ) {
        this.navService.registerHomeBackButtonExit();
        this.menuCtrl.swipeGesture(false);
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }


ionViewWillEnter () {
    this.menuCtrl.swipeGesture(false);
    this.menuCtrl.enable(false);
    // this.authService.currentUser.subscribe((user) => {
    //     console.log(" @@@ ",user);
    // })
  }


    async submitLoginForm () {
        const loader = await this.loaderCtrl.create({
            message: 'Please wait...'
        });
        (await loader).present();
        this.passlength = this.loginForm.value.password.length;
        if (this.passlength < 6) {
            this.authService.presentToast('Invalid email or password');
            this.loaderCtrl.dismiss();
        }
        if (this.loginForm.valid) {
            const credentials = this.loginForm.value;
            this.authService.attemptAuth('login', credentials).then(res => {

                this.loaderCtrl.dismiss();
                this.authService.configuration.subscribe(configuration => this.signupProcessCompleted = configuration.signupProcessCompleted);
                if (this.signupProcessCompleted === true) {
                    this.navService.navigateForword('home');
                    this.authService.userSignedUp = true;

                } else {
                    this.globalVariablesProvider.signInType = 'register';
                    this.globalVariablesProvider.signupProcessCompleted = false;
                    this.navService.navigateForword('add-contacts');
                    // this.navService.navigateRoot('/typeof-user-selection');
                    this.authService.userSignedUp = true;


                }

            }).catch(err => {
                if (err) {
                    this.authService.presentToast('Error in login,please try after sometime');
                    this.loaderCtrl.dismiss();
                    this.authService.userSignedUp = false;

                }

            });
    }
    }

    async signInWithGoogle () {
        this.googlePlus.logout();
        const loader = await this.loaderCtrl.create({
             message: 'Please wait...'
         });
        (await loader).present();
        this.googlePlus.login({})
         .then((res) => {
             const credentials = {
             name : res.displayName,
             email: res.email,
             userId: res.userId,
             createdByAdvisor: false
                   };
             this.authService.attemptAuth('googlesignin', credentials).then(res1 => {
                 this.loaderCtrl.dismiss();
                 this.authService.configuration.subscribe(configuration => this.signupProcessCompleted = configuration.signupProcessCompleted);
                 if (this.signupProcessCompleted === true) {
                     this.navService.navigateForword('home');
                     this.authService.userSignedUp = true;

                 } else {
                     this.globalVariablesProvider.signInType = 'register';
                     this.globalVariablesProvider.signupProcessCompleted = false;
                    //  this.navService.navigateForword('add-contacts');
                     this.navService.navigateRoot('/verify-google-otp');
                    // this.navService.navigateRoot('/typeof-user-selection');
                    this.authService.userSignedUp = true;


                 }

             }).catch(err => {
                 if (err) {
                     this.authService.presentToast('Error in login,please try after sometime');
                     this.loaderCtrl.dismiss();
                     this.authService.userSignedUp = false;

                 }

             });

             this.loaderCtrl.dismiss();
         })
         .catch((err) => {
             this.loaderCtrl.dismiss();
             this.googlePlus.logout();
         });

     }

    goto (page) {
        switch (page) {
            case 'signUp':
                this.navService.navigateRoot('sign-up');    //sign-up  //verify-google-otp
                break;
                case 'forgot':
                    this.navService.navigateRoot(['/forgot-password']);
                    break;
            default:
                break;
        }
    }
    passwordEyeOff () {
        this.password = false;
    }
    passwordEye () {
        this.password = true;
    }
}
