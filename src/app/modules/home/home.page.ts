import { RecordsService } from '../../../app/shared/services/records.service';
import { UploadDocumentComponent } from '@durity/components';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationService, UserService } from '@durity/services';
import { MenuController, NavController, ModalController, Events, AlertController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ContactServiceService } from 'src/app/shared/services/contact-service.service';
import { AttachmentsService } from 'src/app/shared/services/attachments.service';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UploadDocumentsService } from 'src/app/shared/services/upload-documents.service';
import { MicrosurveyComponent } from '../../shared/components/microsurvey/microsurvey.component';
import {PopoverComponent} from './popover/popover.component';
import {Record} from './home.model';
import { Userrecords } from './userrecords.model';
import { Subscription } from 'rxjs';
import {SelectDocumentTypeComponent} from '../../shared/components/select-document-type/select-document-type.component';



declare var window: any;
declare var device: any;



@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit, OnDestroy{
  apiUrl: string = environment.apiUrl;
  attachments = [];
  attachmentsPreview = [];
  family = "Family";
  friends = "Friends";
  others = "Other";
  userName: string;
  useremail: string;
  userData: any;
  userDetails: any;
  isUserEncryptionEnabled: any;
  size: any;
  userId: string;
  token: string;
  header: HttpHeaders;
  hashValue: string;
  biometricKey: any;
  advisorCode: any;
  advisorName: string = "";
  advisorUrl: string = "";
  chckbx1: boolean = false;
  chckbx2: boolean = false;
  chckbx3: boolean = false;
  isFincAdvisor: boolean = false;
  listOfClientsForAdvisor: any = [];
  selectClient: any;
  showViewProfile: boolean = true;
  newUser: boolean = true;
  userWillFormDetails: any;
  progress: number = 0;
  property:boolean = true;
  newValue;
  percentage: number=0;
  fromPopOver: string;
  public records: Record[] = [];
  public userRecords: Userrecords[] = [];
   public commonCategories = ['Life Insurance','Bank Account Details','Credit-Debit Card Details','Fixed Deposit Documents',
   'Medical Records', 'Health Insurance', 'Passport','Personal Documents',
                    'Mutual Fund Documents', 'Tax Records', 'Income Records', 'Professional Licience',
                    'Other'];
  fileNames = [];
  count: number = 0;
  x:number = 2;

  // public catRecords: Record[] = [];
  public recSub: Subscription;
  public randomValue: any;
  // public userRecords: any = [];
  constructor (
    private userService: UserService,
    private navService: NavigationService,
    private router: Router,
    private auth: AuthService,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    private attachmentService: AttachmentsService,
    private navCtrl: NavController,
    private apiService: ApiService,
    private UploadDocumentsService: UploadDocumentsService,
    public globalVariablesProvider: GlobalVariablesService,
    private contactService: ContactServiceService,
    private http: HttpClient,
    public events: Events,
    public alertController: AlertController,
    public popover: PopoverController,
    public recordService: RecordsService,
    
   
) {
    this.auth.currentUser.subscribe((user) => {
      // console.log('1111 : ', user);
      this.userId = user._id;
      this.token = user.token;
      this.header = new HttpHeaders({
        'content-type': 'application/json',
        Authorization: this.token,
      });
     
    });

    this.events.subscribe('username', (data) => {
     
      console.log(data);
      this.userName = data;
      console.log('constructor');
      //this.getAttachments();
      this.getMyFiles();
    })

    this.events.subscribe('advisorUrl', (data) => {
      this.advisorUrl = data.advisorUrl;
      this.advisorCode = data.advisorCode;
      this.advisorName = data.advisorName;
    })

    this.http
      .get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {
        headers: this.header,
      })
      .subscribe((res) => {
        // console.log("------------- : ",res)
        this.auth.setAuth(res);
      });
    if (this.isFincAdvisor) {
      this.getAdvisorClientList();
    }

    // this.attachmentService.getAttachments();
    // this.auth.currentUser.subscribe((info) => {
    //   console.log("1111 : ",user);

    //   this.isUserEncryptionEnabled = info.configuration.userEncryption.isEnabled;
    // });
    // });
    this.globalVariablesProvider.isUserEncryptionEnabled = this.isUserEncryptionEnabled;
    this.globalVariablesProvider.signInType = "login";
    this.userData = this.auth.currentUser.subscribe(
      (user) => {
        (this.userName = user.profile.name), 
        (this.userDetails = user)
        this.userName = user.profile.name,
        this.advisorCode = user.profile.advisorCode;
        this.advisorName = user.profile.advisorName;
      this.isUserEncryptionEnabled = user.configuration.userEncryption.isEnabled;
      this.userName = user.profile.name,
       this.userDetails = user
      if(user.profile.advisorUrl == (null || undefined || '') ){
        this.advisorUrl = '';
      }else{
        this.advisorUrl = user.profile.advisorUrl;
      }
      this.isFincAdvisor = user.profile.isFinancialAdvisor;
      if(user.profile.isFinancialAdvisorClient == true){
        console.log("This user is a client")
        this.globalVariablesProvider.isUserAclient = true;
      } else {
        this.globalVariablesProvider.isUserAclient = false;

      }
    
    }
    );
    this.contactService.getContacts();
    this.globalVariablesProvider.addMoreContacts = false;
    // this.generateBiometricPublicKey();
    let TIME_IN_MS = 10000;
    this.http
      .get(`${this.apiUrl}/user/surveyDetails?email=${this.userDetails.email}`, {
        headers: this.header,
      })
      .subscribe((res) => {
        console.log("------------- : ",res)
       let surveyCount = res;
       console.log(surveyCount['count'])
       if(surveyCount['count'] == ('0' || 0) || surveyCount['count'] == ('1' || 1) ){
         console.log('start survey')
        let hideFooterTimeout = setTimeout(() => {
            this.presentAlertMultipleButtons();
          }, TIME_IN_MS);  
       }else{
         console.log('no survey')
       }
          
      });
   
    
    
    this.http
      .get(`${this.apiUrl}/user/getUserDetails?email=${this.userDetails.email}`).subscribe((res) => {
        console.log(res)
        this.userWillFormDetails = res
        console.log("save==", this.userWillFormDetails.willFormDetails.saveWillFormDetails)
        if (this.userWillFormDetails.willFormDetails.saveWillFormDetails === true) {
          this.newUser = false;
          console.log("newuser==",this.newUser);
        } else {
          this.newUser = true;
          console.log("newuser==",this.newUser);

        }
      });
  /*   this.apiService.get({name: 'mycount'}).subscribe(res => {
        console.log(res);
        this.count = res.count;
        if (this.count == 1){
         this.commonCategories.forEach(category => {
            this.recordService.postRecords(category);
          });
          // this.recordService.postCategory(this.commonCategories);
          }
    });
    this.apiService.post('mycount', {count: this.x}).subscribe( res1 => {
            console.log(res1);
            //this.count = res.count;
            console.log(res1);
          }); */
    
  }
      
  ngOnInit () {
    this.apiService.get({name: 'mycount'}).subscribe(res => {
      console.log(res);
      this.count = res.count;
      if (this.count == 1){
        this.commonCategories.forEach(category => {
          this.recordService.postRecords(category);
        });
        this.apiService.post('mycount', {count: this.x}).subscribe( res1 => {
        });
      }
    });
    this.recordService.getUserRecords();
    this.recSub = this.recordService.getRecordUpdateListener().subscribe((userrecord: Userrecords[]) => {
      this.userRecords = userrecord;
    });
    // this.getAttachments();
  
}

  getAdvisorClientList() {
    this.http
      .get(`${this.apiUrl}/user/getListOfClientsOnAdvCode?advisorCode=${this.advisorCode}`, {
        headers: this.header,
      })
      .subscribe((res) => {
        // console.log(res);
        // this.auth.setAuth(res);
        this.listOfClientsForAdvisor = res;

      });
  }

  ionViewWillEnter() {
    // this.recordService.getUserRecords();
    console.log('ionViewwillEnter');
   
    this.recSub = this.recordService.getRecordUpdateListener().subscribe((userrecord: Userrecords[]) => {
      console.log('observerrrrrrrrrrrrrrrr');
      this.userRecords = userrecord;
    });
    this.getMyFiles();

    this.auth.currentUser.subscribe((user) => {
      this.userId = user._id;
      this.token = user.token;
      this.userName = user.profile.name,
        this.advisorCode = user.profile.advisorCode;
      this.advisorName = user.profile.advisorName;
      if (user.profile.advisorUrl == (null || undefined || '') ) {
        this.advisorUrl = '';
      } else {
        this.advisorUrl = user.profile.advisorUrl;
      }
      this.isFincAdvisor = user.profile.isFinancialAdvisor;
      this.header = new HttpHeaders({
        'content-type': 'application/json',
        Authorization: this.token,
      });
    });
    
    if (this.isFincAdvisor == true) {
      this.getAdvisorClientList();
      this.events.subscribe('advisorUrl', (data) => {
        this.advisorUrl = data;
      })
      this.events.subscribe('username', (data) => {
        console.log("%%%%%%%%%%%%%%");
        // console.log(data);
        this.listOfClientsForAdvisor = JSON.parse(data);
        // this.userName = data;
      })
    }
    // this.getAttachments();
    this.menuCtrl.enable(true);
  }
  ngOnDestroy() {
    this.recSub.unsubscribe();
  }

  getMyFiles(){
    this.apiService.get({ name: 'myFiles' }).subscribe(
      (attachments) => {
        console.log('checkingggggggggggggggggggggggggggggg');
        for(let i = 0; i< attachments.length; i++){
          this.userRecords.forEach(records => {
            if(attachments[i].category === records.category){
             records.property = true;
            }
          });
        }
        const fileCategories = [];
        const uniqueCategories = [];
        attachments.forEach(file => {
            fileCategories.push(file.category);
          });
        const uniqueSet = new Set(fileCategories);
        uniqueSet.forEach(element => {
          uniqueCategories.push(element);
        });
     
        if(uniqueCategories.length !== 0) {
          console.log(this.userRecords.length);
          this.newValue = 1 / (this.userRecords.length) * (uniqueCategories.length);
          this.progress = this.newValue;
          this.percentage =  Math.floor(this.newValue * 100);
        } else {
          this.progress = 0;
          this.percentage = 0;
        }
      },
      (error) => { }
    );
    
  }

  chooseClient(selectClient) {
    selectClient = JSON.parse(selectClient);
    this.apiService.userId = selectClient._id;
    console.log(this.selectClient);
    if (selectClient.profile.isFinancialAdvisor == true) {
      this.showViewProfile = true;
      this.globalVariablesProvider.isUserAclient = false;
      
    } else {
      this.showViewProfile = false;
      this.globalVariablesProvider.isUserAclient = true;

    }
    console.log("33333333333333333333333333333")
    this.auth.currentUser.subscribe((user) => (
      // console.log(user)
      user._id = selectClient._id,
      user.configuration.signupProcessCompleted = selectClient.configuration.signupProcessCompleted,
      user.configuration.userEncryption.passwordHash = selectClient.configuration.userEncryption.passwordHash,
      user.configuration.userEncryption.isEnabled = selectClient.configuration.userEncryption.isEnabled,
      user.userCurrentPlanDetails = selectClient.userCurrentPlanDetails,
      user.profile.telephoneNumber = selectClient.profile.telephoneNumber,
      user.profile.name = selectClient.profile.name,
      user.profile.alternateEmailAddress = selectClient.profile.alternateEmailAddress,
      user.profile.alternateTelephoneNumber = selectClient.profile.alternateTelephoneNumber,
      user.profile.picture.data = selectClient.profile.picture.data,
      user.email = selectClient.email,
      this.userName = user.profile.name
    ));

  }

  navigateToProfile() {
    this.navService.navigateForword('/client-profile-screen');

  }

  viewDocument(index) {
    this.router.navigate(["/view-document", index]);
  }

  goto(pageName, data?) {
    this.navService.goto(pageName, data);
  }

  async addDocument(r) {
    this.router.navigate(['/select-doc', r]);
  }

  viewAllDocuments() {
    this.navService.navigateForword("/document-list");
  }

  async familyContactsTab() {
    this.navService.navigateRoot("contact-list");
    const relation = this.family;
    localStorage.setItem("relation", relation);
  }

  async friendsContactsTab() {
    this.navService.navigateRoot("contact-list");
    const relation = this.friends;
    localStorage.setItem("relation", relation);
  }

  async othersContactsTab() {
    this.navService.navigateRoot("contact-list");
    const relation = this.others;
    localStorage.setItem("relation", relation);
  }

  generateBiometricPublicKey() {
    window.cordova.plugins.CustomBiometricPlugin.generatePublicKey(
      1024,
      "mdurity",
      (res) => {
        console.log(res);
        this.biometricKey = res;
      },
      (err) => {
        return err;
      }
    );
  }

  async addDeviceToBiometric() {
    var userDeviceDetails = {
      operatingSystem: device.platform,
      UUID: device.uuid,
      keyStoreId: "mdurity",
      deviceType: "mobile",
      publicKeyId: this.biometricKey,
      userId: this.userDetails._id,
      encRandKey: "",
      encRandIv: "",
    };

    this.UploadDocumentsService.addDevicForBiometric(userDeviceDetails);
  }

  goToWillForm() {
    this.http
      .get(`${this.apiUrl}/user/getUserDetails?email=${this.userDetails.email}`).subscribe((res) => {
        console.log(res)
        this.userWillFormDetails = res
        console.log("save==", this.userWillFormDetails.willFormDetails.saveWillFormDetails)
        if (this.userWillFormDetails.willFormDetails.saveWillFormDetails === true) {
          this.newUser = false;
          console.log("newuserIF==",this.newUser);

        } else {
          this.newUser = true
          console.log("newuserELSE==",this.newUser);
          console.log("saveform==",this.userWillFormDetails.willFormDetails.saveWillFormDetails)

        }
      })
    this.navService.navigateForword("/generate-will");
  }
  async presentAlertMultipleButtons() {
    if(this.auth.userSignedUp == true){
    const alert = await this.alertController.create({

      header: 'Help us improve!',
      cssClass: 'sure-bold',
      message: 'Your feedback matters to us. We have 4 questions for you.',
      buttons: [
        {
          text: 'No Thanks',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sure',
          cssClass : 'sure-bold',
          handler: () => {
            console.log('Confirm Okay');
            this.presentSurveyModal()

          }
        }
      ]
    });

    await alert.present();
  }
  }

  async presentSurveyModal() {
    // alert("works")
    const modal = await this.modalCtrl.create({
      component: MicrosurveyComponent,
      cssClass: 'custom-modal',


    });
    return await modal.present();
  }
  async popOver () {
    const popover = await this.popover.create({
      component: PopoverComponent,
      cssClass: 'add-category-class',
    });
    popover.onDidDismiss().then( (data: any) => {
      console.log(data);
      if(data !== undefined){
        console.log(data.data.frompopover);
      }
      this.fromPopOver = data.data.frompopover;
      const catrecord = {category: this.fromPopOver};
      this.recordService.postRecords(this.fromPopOver);
      console.log('from' + this.fromPopOver);
      // this.ionViewWillEnter();
      // this.getAttachments();
      this.getMyFiles();
    });
    
    return await popover.present();
   
  }
  upload(){
    console.log('hi');
  }

}
