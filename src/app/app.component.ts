import { Component, OnDestroy, AfterViewInit, OnInit, AfterContentChecked } from '@angular/core';
import { Platform, MenuController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { SignupWizardService } from './shared/services/signup-wizard.service';
import { NavigationService } from '@durity/services';
import { GlobalVariablesService } from './services/global-variables.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { DeletePopoverComponent } from './shared/components/delete-popover/delete-popover.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DomSanitizer } from '@angular/platform-browser';




declare var UXCam:any;

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements AfterContentChecked {
    user: any;
    playstoreUrl:any="https://play.google.com/store/apps/details?id=com.durity&hl=en_IN";
    isUserSignedUp = false;
    

    public appPages = [
       
        {
            title: 'Subscription Plan',
            type: 'navigate',
            url: '/upgrade-plan',
            iconImg:'',
            icon: 'card'
        },
        {
            title: 'Add Client',
            type: 'navigate',
            url: '/add-new-client',
            iconImg:'',
            icon: 'person-add'
        },
        
        {
            title: 'FAQs',
            type: 'navigate',
            url: '/faqs',
            iconImg:'',
            icon: 'help-circle-outline'
        },
        {
            title: 'Claim',
            type: 'navigate',
            url: '/claim',
            iconImg: '../assets/imgs/claim.svg',
            icon: ''
        }, 
        {
            title: 'Contact Us',
            type: 'navigate',
            url: '/contact-us',
            iconImg:'assets/imgs/Group 1898.svg',
            icon: 'assets/imgs/Group 1898.svg'
        },
        {
            title: 'Privacy, Terms & Conditions',
            type: 'navigate',
            link: 'http://durity.life/',
            url: '',
            iconImg:'assets/imgs/Group 1593.svg',
            icon: 'assets/imgs/Group 1593.svg'
        },
         {
            title: 'Settings',
            type: 'navigate',
            url: '/settings',
            iconImg:'',
            icon: 'settings'
        },
        {
            title: 'About Us',
            type: 'navigate',
            link: 'http://durity.life/',
            url: '',
            iconImg:'',
            icon: 'information-circle'
        },
        {
            title: 'Refer a Friend',
            type: 'share',
            url: '',
            iconImg:'assets/imgs/Refer-friend.svg',
            // url: '/list',
            icon: 'share'
        },
    ];

    public appPagesForClient = [
        
        {
            title: 'Subscription Plan',
            type: 'navigate',
            url: '/upgrade-plan',
            iconImg: '',
            icon: 'card'
        },
                
        {
            title: 'FAQs',
            type: 'navigate',
            url: '/faqs',
            iconImg: '',
            icon: 'help-circle-outline'
        },
        {
            title: 'Claim',
            type: 'navigate',
            url: '/claim',
            iconImg: '../assets/imgs/claim.svg',
            icon: ''
        }, 
        
         {
            title: 'Settings',
            type: 'navigate',
            url: '/settings',
            iconImg: '',
            icon: 'settings'
            
        },
        {
            title: 'About Us',
            type: 'navigate',
            link: 'http://durity.life/',
            url: '',
            iconImg: '',
            icon: 'information-circle'
        },
        {
            title: 'Contact Us',
            type: 'navigate',
            url: '/contact-us',
            iconImg: 'assets/imgs/Group 1898.svg',
            icon: ''
        },
        {
            title: 'Terms and Conditions',
            type: 'navigate',
            url:  '',
            link: 'http://durity.life/',
            iconImg: '../assets/icon/terms And conditions.svg',
            icon: ''
        },
        {
            title: 'Privacy Policy',
            type: 'navigate',
            url: '',
            link: 'http://durity.life/',
            iconImg: '../assets/icon/Privacy.svg',
            icon: ''
        },
        {
            title: 'Refer a Friend',
            type: 'share',
            url: '',
            iconImg:'assets/imgs/Refer-friend.svg',
            // url: '/list',
            icon: 'share'
        },
        // {
        //     title: 'About Us',
        //     type: 'navigate',
        //     url: '/',
        //     iconImg:'',
        //     icon: 'information-circle'
        // },
        
    ];

    otherMenus: any = [
        {
            title: 'Sign Out ',
            url: '/log-out',
            icon: 'log-out'
        }

    ];

    userName: string;
    isAuthenticated: boolean;
    backButtonSubscription: any;
    private secureStorageObject: SecureStorageObject;
    private deviceSecure = false;

    constructor (
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private menu: MenuController,
        private modalCtrl: ModalController,
        private router: Router,
        private auth: AuthService,
        private navigationService: NavigationService,
        private googlePlus: GooglePlus,
        private secureStorage: SecureStorage,
        private service: SignupWizardService,
        private bnIdle: BnNgIdleService,
        public globalVariablesProvider: GlobalVariablesService,
        private dialogs: Dialogs,
        private navService: NavigationService,
        private socialSharing: SocialSharing,
        private dom: DomSanitizer,


    ) {
        this.getUser();
        this.initializeApp();
        this.bnIdle.startWatching(1000).subscribe((res) => {
            if (res && this.router.url !== '/login') {
                alert('Session Timeout');
                this.navigationService.navigateRoot(['/login']);
            }
          });
    }
    ngAfterContentChecked() {
        this.isUserSignedUp = this.auth.userSignedUp;
        // console.log("auth == ", this.isUserSignedUp)
    }

    initializeApp () {
        this.platform.ready().then(() => {
            UXCam.startWithKey("f5bhq744nhgkaz8");
            this.statusBar.styleDefault();
            this.statusBar.overlaysWebView(false);
            this.splashScreen.hide();
            this.navigationService.registerHomeBackButtonExit();
        });

    }

    public get profilePic () {
        return this.dom.bypassSecurityTrustUrl(`data:${this.user.profile.picture.contentType};base64,${this.user.profile.picture.data}`);
      
      }

    getUser () {
        this.auth.currentUser.subscribe((user) => {
          this.user = user;
          });
    }


    goBack () {
        this.menu.close();
    }

    goto (page) {
        if (page.type === 'popover') {
            this.deleteUserAccount(this.user);
        } else if(page.type == 'share'){
            let options ={message: this.playstoreUrl};

this.socialSharing.shareWithOptions(options).then(()=>{

})
        }
        else {
            if (page.url !== '') {
                this.router.navigate(['/' + page.url]);
            } else if (page.url === '') {
                window.open(page.link,  '_system', 'location=yes' );
            }

            this.menu.close();
        }
    }

    gotoProfile () {
        this.navService.navigateForword('/profile-screen');
        this.menu.close();
    }

    gotoLogin (page) {
        this.router.navigate(['/' + page.url]);
        this.googlePlus.logout();
        this.auth.purgeAuth();
        this.menu.close();
        this.isUserSignedUp = false;
        this.auth.userSignedUp = false;
    }

    async deleteUserAccount(User) {
        this.menu.close();
        const modal = await this.modalCtrl.create({
            component: DeletePopoverComponent,
            cssClass: 'simple-delete-user-modal',
            componentProps: { deleteType: 'deleteUserAccount', user: User, contactId: '', fileName: '' }
        });
        await modal.present();
    }
}
