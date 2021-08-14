import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { NavigationService } from '@durity/services';
import { EncryptionPopoverComponent } from '../encryption-popover/encryption-popover.component';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-encrypt-details',
  templateUrl: './encrypt-details.component.html',
  styleUrls: ['./encrypt-details.component.scss'],
})
export class EncryptDetailsComponent {
  apiUrl: string = environment.apiUrl;

  activeSection: any = 'contacts';
  setPass: any = false;
  public upload = false;
  userId: string;
  token: string;
  header: HttpHeaders;


  constructor (

    public modalController: ModalController,
    private navService: NavigationService,
    public globalVariablesProvider: GlobalVariablesService,
    public popoverController: PopoverController,
    private storage: Storage,
    private apiService: ApiService,
    private auth: AuthService,
    private http: HttpClient

  ) { 
    this.auth.currentUser.subscribe((user) => {
      this.userId = user._id;
      this.token = user.token;
      this.header = new HttpHeaders({
       'content-type': 'application/json',
       Authorization: this.token,
   });
   });
    // let userEmail
    // this.auth.currentUser.subscribe(user => userEmail = user.email)
    // storage.set(userEmail, 'encrypt-details');

  }

  getStarted () {
    // this.navService.navigateForword('/security');
    this.upload = false;
    this.globalVariablesProvider.encryptFile = true;
    // this.navService.navigateForword('/select-doc');
    localStorage.setItem('Upload', JSON.stringify(this.upload));
    // this.apiService.post('user/userEncryptionStatus', {userEncryption: {isEnabled: true, algorithm: 'AES-256'}}).subscribe((data) => {
    //   this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
    //     this.auth.setAuth(res);
    // });
    // });
    this.apiService.post('user/signupProcessStatus', {signupProcessCompleted: true}).subscribe((data) => {
      this.navService.navigateForword('/home');
    });
    // this.navService.navigateForword('/select-doc');

  }
  skip () {
    this.navService.navigateForword('/home');
    // this.modalCtrl.dismiss();
  }
  next () {
    this.navService.navigateForword('/will-com');
  }

  goBack () {
    this.navService.navigateBack ();
  }
isaboutEncription = false
  async aboutEncryption () {
    if(this.isaboutEncription == false) {
      this.isaboutEncription = true
    }else if(this.isaboutEncription == true) {
      this.isaboutEncription = false
    }
    // const popover = await this.popoverController.create({
    //   component: EncryptionPopoverComponent,
    //   translucent: true,
    //   backdropDismiss: false,
    //   cssClass: 'custom-popoverEncryption'
    // });
    // return await popover.present();

  }

  //New Onboarding Screen
  willQes = ['Top 5 misconceptions of creating a Will.', "I'm only in my 40's, do I need to create a Will?", "What happens if I don't have a Will?"];


isUploadInfo = true;
uploadCardIcon = '../../../../../assets/imgs/Uparrow Icon.svg';
isuploadDoc = false;
isuploadDocArrow = "../../../../../assets/imgs/Downarrow Icon.svg";
isAssignBeneficiary = false
isAssignBinaryArrow = "../../../../../assets/imgs/Downarrow Icon.svg";
isWillInfo = false
isWillArrow = "../../../../../assets/imgs/Downarrow Icon.svg";
isLockInfo = false
isLockArrow = '../../../../../assets/imgs/Downarrow Icon.svg';



  uploadInfo() {
    console.log('upload info : ',this.isUploadInfo)
    if(this.isUploadInfo == false) {
      this.isUploadInfo = true
      this.uploadCardIcon ='../../../../../assets/imgs/Uparrow Icon.svg'
      this.isWillInfo = false
      this.isWillArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
      this.isLockInfo = false
      this.isLockArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
    } else if(this.isUploadInfo == true) {
      this.isUploadInfo = false
      this.uploadCardIcon = '../../../../../assets/imgs/Downarrow Icon.svg';
      this.isWillInfo = false
      this.isWillArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
      this.isLockInfo = false
      this.isLockArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
     
    }
   
  }
  
  uploadDoc() {
    if(this.isuploadDoc == false) {
      this.isuploadDoc = true;
      this.isuploadDocArrow = "../../../../../assets/imgs/Uparrow Icon.svg"
    } else if(this.isuploadDoc == true) {
      this.isuploadDoc = false
      this.isuploadDocArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
    }

  }
  
  assignBeneficiary() {
    if(this.isAssignBeneficiary == false ) {
      this.isAssignBeneficiary = true
      this.isAssignBinaryArrow = "../../../../../assets/imgs/Uparrow Icon.svg"
    } else if(this.isAssignBeneficiary == true) {
      this.isAssignBeneficiary = false
      this.isAssignBinaryArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
    }
  }
 
  willInfo() {
    console.log('willInfo info : ',this.isWillInfo)

    if(this.isWillInfo == false) {
      this.isWillInfo = true
      this.isWillArrow = "../../../../../assets/imgs/Uparrow Icon.svg"
      this.isUploadInfo = false
      this.uploadCardIcon = '../../../../../assets/imgs/Downarrow Icon.svg';
      this.isLockInfo = false
      this.isLockArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
    } else if (this.isWillInfo == true){
      this.isWillInfo = false
      this.isWillArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
    }
    
  }
  
  LockInfo(){
    console.log('LockInfo info : ',this.isLockInfo)

    if(this.isLockInfo == false){
      this.isLockInfo = true
      this.isLockArrow = "../../../../../assets/imgs/Uparrow Icon.svg"
      this.isUploadInfo = false
      this.uploadCardIcon = '../../../../../assets/imgs/Downarrow Icon.svg';
      this.isWillInfo = false
      this.isWillArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
    } else if (this.isLockInfo == true){
      this.isLockInfo = false
      this.isLockArrow = "../../../../../assets/imgs/Downarrow Icon.svg"
    }
  }
  isMoreInfo = false;
  lockMoreInfo() {

    if(this.isMoreInfo == false) {
      this.isMoreInfo = true;
    } else if(this.isMoreInfo == true) {
      this.isMoreInfo = false;
    }
  }
}

