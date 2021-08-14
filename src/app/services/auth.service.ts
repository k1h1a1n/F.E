import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CacheService } from 'ionic-cache';
import { ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { Platform, AlertController, ToastController, NavController, LoadingController, ModalController } from '@ionic/angular';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Response } from 'selenium-webdriver/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { reject } from 'q';
import { GlobalVariablesService } from './global-variables.service';
import { NavigationService } from '../shared/services/navigation.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

const TOKEN_KEY = 'access_token';

class User {
    email: string ;
    token: string;
    username: string;
    bio: string;
    image: string;
    _id: string;
    durity_id: string;
    profile: any ;
    roles: string;
    documentsList: any = [];
  configuration: any;
  userCurrentPlanDetails: any;
    get roleName () {
        if (!this.roles[0]) {
            return 'regular';
        } else if (this.roles[0] === 'admin') {
            return 'verifier';
        } else {
            return this.roles[0];
        }

    }
}

class Configuration {
    configuration: any;
    signupProcessCompleted: boolean;
    userEncryptiondHash: any;

}

@Injectable()
export class AuthService {
    url = environment.apiUrl;
    user = null;
    authenticationState = new BehaviorSubject(false);
    private currentUserSubject = new BehaviorSubject<User>(new User());
    public currentUser = this.currentUserSubject.asObservable();

    private configurationSubject = new BehaviorSubject<Configuration>(new Configuration());
    public configuration = this.configurationSubject.asObservable();

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable().pipe(distinctUntilChanged());


    // tslint:disable-next-line: ban-types

    httpOptions: any;
    userToken: any;
    signInType: string;
    userSignedUp: boolean;
    constructor (
        private cache: CacheService,
        private http: HttpClient,
        private router: Router,
        private storage: Storage,
        private plt: Platform,
        private googlePlus: GooglePlus,
        private alertController: AlertController,
        private modalCtrl: ModalController,
        public toastCtrl: ToastController,
        private helper: JwtHelperService,
        public loaderCtrl: LoadingController,
        public navCtrl: NavController,
        private navService: NavigationService,
        public globalVariablesProvider: GlobalVariablesService,
        public alertCtrl: AlertController,

    ) {
        const headers = new HttpHeaders({});
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('content-type', 'application/json');
        this.httpOptions = { headers };

        // test code
        this.plt.ready().then(() => {
            this.checkToken();
        });

        // needs a better solution
        // when reset route is requested, tokenmanager function runs as
        // it is injected into navbar and purgeAuth is called
        // redirecting the page to login. which should not happen as reset page does
        // not need the user to be logged in

        if (!window.location.href.includes('reset')) {
            this.tokenManager();
        }

    }
    // test code
    checkToken () {
        this.storage.get(TOKEN_KEY).then(token => {
            if (token) {
                const decoded = this.helper.decodeToken(token);
                const isExpired = this.helper.isTokenExpired(token);

                if (!isExpired) {
                    this.user = decoded;
                    this.authenticationState.next(true);
                } else {
                    this.storage.remove(TOKEN_KEY);
                }
            }
        });
    }


    tokenManager () {
        if (this.http.get('token')) {
            this.currentPerson();

        } else {
            this.purgeAuth();
        }

    }

    currentPerson () {
        this.http.get(`${environment.apiUrl}/user/authenticate`).subscribe(user => {
            this.setAuth(user);
            // this.userName = this.user.profile.name;
        }, error => {
            this.purgeAuth();
        });
    }

    setAuth (user) {
        console.log(user);
        // Save JWT sent from server in localstorage
        if (user.token.length) {
            this.http.put('token', user.token);
            // localStorage.setItem("userid", user.user._id);
            // localStorage.setItem("email", user.user.email);


            this.userToken = user.token;
            this.globalVariablesProvider.token = this.userToken;
            // Set current user data into observable
            this.currentUserSubject.next(Object.assign(new User(), user.user, { token: user.token.includes('Bearer ') ? user.token : 'Bearer ' + user.token }));
            this.configurationSubject.next(Object.assign(new Configuration (), user.configuration, {signupProcessCompleted: user.configuration.signupProcessCompleted}, {configuration: user.configuration} ));
            // Set isAuthenticated to true
            this.isAuthenticatedSubject.next(true);
        } else {
            // if user not present, the api still return a field 'token' that is empty
            this.purgeAuth();
        }
    }

    purgeAuth () {
        // Remove JWT from localstorage
        this.storage.remove('token');
        this.currentUserSubject.next(new User());
        // this.storage.clear();
        // this.cache.clearAll ();

        // Set current user to an empty object
        this.currentUserSubject.next(new User());
        this.currentUser = this.currentUserSubject.asObservable();

        this.configurationSubject.next(new Configuration ());
        // Set auth status to false
        this.isAuthenticatedSubject.next(false);

        this.navCtrl.navigateRoot('/login');

    }

    attemptAuth (type, credentials) {
        return new Promise(resolve => {
            if (type === 'login') {
                this.globalVariablesProvider.signInType = 'login';
                this.signInType = 'login';
                this.http.post(`${environment.apiUrl}/user/authenticate`, { email: credentials.email, password: credentials.password, redirect: '/home' }, this.httpOptions)
                    .subscribe((data) => {
                        this.setAuth(data);
                        resolve(true);


                    }, (error) => {
                        if (error.status === 400) {
                            this.presentToast(error.error.message);
                            this.loaderCtrl.dismiss();
                            reject(error);
                        }
                    });
            } else if (type === 'register') {
                // console.log(credentials);
                this.globalVariablesProvider.signInType = 'register';
                this.http.post(`${environment.apiUrl}/user/signup`,
                    {
                        profile: { name: credentials.name, telephoneNumber: credentials.telephoneNumber, },
                        email: credentials.email,
                        phone: credentials.phone,
                        googlesignin : false,
                        password: credentials.password,
                        confirmPassword: credentials.password,
                        createdByAdvisor: credentials.createdByAdvisor

                    }).subscribe((data) => {
                        this.userToken = data['token '];
                        this.setAuth(data);
                        resolve(true);
                    }, (error) => {
                        if (error.status === 400) {
                          this.loaderCtrl.dismiss();
                          this.presentToast(error.error.message);
                          reject(error);
                        }
                    });

            } else if (type === 'forgot') {
                // this.popAfterForgetPwd(credentials.email)
                // resolve(true);
                this.http.post(`${environment.apiUrl}/user/forgot`,
                    {
                        email: credentials.email
                    }).subscribe((data) => {
                        resolve(true);
                        
                        // display user A link has been sent to the email to reset the password
                    });
            } else if (type === 'googlesignin') {
                this.globalVariablesProvider.signInType = 'register';

                this.http.post(`${environment.apiUrl}/user/signup`,
                    {
                        profile: { name: credentials.name, },
                        email: credentials.email,
                        googlesignin : true,
                        password: credentials.userId,
                        confirmPassword: credentials.userId,
                        createdByAdvisor: credentials.createdByAdvisor

                    }).subscribe((data) => {
                        this.userToken = data['token '];
                        this.setAuth(data);
                        resolve(true);
                    }, (error) => {
                        if (error.status === 400) {
                            this.loaderCtrl.dismiss();
                            this.presentToast(error.error.message);
                            reject(error);
                        }
                    });
            }else if(type == "addClient"){
                // this.globalVariablesProvider.signInType = 'register';
                this.http.post(`${environment.apiUrl}/user/signup`,
                    {
                        profile: { name: credentials.name, telephoneNumber: credentials.telephoneNumber,  },
                        email: credentials.email,
                        phone: credentials.phone,
                        googlesignin : false,
                        password: credentials.password,
                        confirmPassword: credentials.password,
                        createdByAdvisor: credentials.createdByAdvisor,
                        advisorCode: credentials.advisorCode,
                        advisorName: credentials.advisorName,
                        advisorUrl: credentials.advisorUrl
                    }).subscribe((data) => {
                        console.log(data);
                        // this.userToken = data['token '];
                        // this.setAuth(data);
                        resolve(true);
                    }, (error) => {
                        if (error.status === 400) {
                          this.loaderCtrl.dismiss();
                          this.presentToast(error.error.message);
                        //   reject(error);
                        }
                    });
            }
        });
    }
    async presentToast (msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

    async popAfterForgetPwd(email){
        console.log('discontinue ....');
        const alert = await this.alertCtrl.create({
            message: 'We have sent a temporary password to your registered email '+email,
                 buttons:[ 
              {
                text: 'Ok',
                handler: () => {
                this.navService.navigateRoot(['/login']);
                }
              }
            ]
        });
        await alert.present();
      }

    logout () {
        this.http.get(`${environment.apiUrl}/user/logout`)
            .subscribe(data => {
                this.purgeAuth();

            }, error => {

            });
    }

    resetPassword (password: string, token: string) {
        this.http.post(`${environment.apiUrl}/user/reset/${token}`, { password, confirmPassword: password })
            .subscribe(response => {
            }, error => {
            });
    }

    getCurrentUser (): User {
        return this.currentUserSubject.value;
    }

    getConfigurationSettings (): Configuration {
        return this.configurationSubject.value;
    }

    setCurrentUser (user) {
        user = Object.assign(this.getCurrentUser(), user);
        user = Object.assign(this.getConfigurationSettings (), user);
        this.currentUserSubject.next(user);
        this.configurationSubject.next(user);
    }

    getToken () {
        return this.http.get('token');
    }
    getTokenTemp () {
        return this.userToken;
    }

    deleteUserAccount (user) {
        this.http.post(`${environment.apiUrl}/user/delete`, { userDetail: user }).subscribe((data) => {
            this.loaderCtrl.dismiss ();
            this.modalCtrl.dismiss ();
            this.navService.navigateRoot('/login');
            this.googlePlus.logout ();
            this.cache.clearAll ();
        }, (error) => {
            if (error.status === 400) {
                this.presentToast(error.error.message);
                reject(error);
            }
        });
    }
}
