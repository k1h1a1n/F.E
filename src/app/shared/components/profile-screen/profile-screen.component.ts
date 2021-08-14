import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PopoverController, ModalController, ActionSheetController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AddAdvisorComponent } from '../add-advisor/add-advisor.component'
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import * as sha1 from 'js-sha1';
import { File } from '@ionic-native/file/ngx';
import { async } from '@angular/core/testing';
import { ApiService } from 'src/app/services/api.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64 } from '@ionic-native/base64';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';



@Component({
  selector: 'app-profile-screen',
  templateUrl: './profile-screen.component.html',
  styleUrls: ['./profile-screen.component.scss'],
})
export class ProfileScreenComponent implements OnInit {

  user;
  enteredAdvCode: any = '';
  userForm: FormGroup;
  userName: string;
  isAuthenticated: boolean;
  durityid = 12345;
  profileForm: FormGroup;
  advisorForm: FormGroup;
  advisorName: String = "";
  advisorCode: String = "";
  advisorUrl: String = "";
  advOrgName:any = '';
  public fileName: any;
  isReadonl:boolean = true;
  logoname:any = '';
  videoId: any;
    fileUrl: string;
  fileDir: string;
  name: any;
  fileChecksumValue: any;
  loader:any;
  base64OfLogo:any = '';
  public profilePicImage;
  isLoading = false;
  checkboxForFinAdvLink:boolean = false;
  checkboxForChangeToFinAdv:boolean = false;
  invalidAdvCode:any = '';
  advisorDetails:any;
  profilePicValue:any;
  noPic:any;
  constructor (
    public camera: Camera,
    private formBuilder: FormBuilder,
    private dom: DomSanitizer,
    public popoverController: PopoverController,
    public modalController: ModalController,
    public alertCtrl: AlertController,
    private signUpWizardService: SignupWizardService,
    private authService: AuthService,
    private navService: NavigationService,
    public fileChooser: FileChooser,
    private file: File,
    public fileOpener: FileOpener,
    public actionsheetCtrl: ActionSheetController,
    public filePath: FilePath,
    public platform: Platform,
    public apiService: ApiService,
    public loadingCtrl: LoadingController,
    public globalVariablesProvider: GlobalVariablesService
  ) {
    // this.profileForm = this.fb.group({
    //   Name: ['', Validators.required],
    //   Email1: ['', Validators.required],
    //   Email2: [''],
    //   Phone1: ['', Validators.required],
    //   Phone2: ['']
    // });
    // this.advisorForm = this.fb.group({
      
    // });
    this.userForm = this.formBuilder.group({
      name: ['', [
        Validators.required
      ]],
      email:[''],
      telephoneNumber:['', [Validators.pattern(String.raw`^[0-9]*$`)]],
      alternateEmailAddress:[''],
      alternateTelephoneNumber: [''],
      advisorOrgName: ['']
  });

    this.getUser();

    this.userForm.get('name').setValue(this.user.profile.name);
    this.userForm.get('email').setValue(this.user.email);
    if(this.user.profile.telephoneNumber.includes('+91')){
      let numb = this.user.profile.telephoneNumber.split('+91');
      this.userForm.get('telephoneNumber').setValue(numb[1]);

    }else{
      this.userForm.get('telephoneNumber').setValue(this.user.profile.telephoneNumber);

    }
        
    this.userForm.get('alternateEmailAddress').setValue(this.user.profile.alternateEmailAddress);
    this.userForm.get('alternateTelephoneNumber').setValue(this.user.profile.alternateTelephoneNumber);
    if(this.user.profile.advisorOrgName){
      this.userForm.get('advisorOrgName').setValue(this.user.profile.advisorOrgName);

    }
    // this.userForm.get('name').setValue(this.user.profile.name);



}

ngOnInit () {}
options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.FILE_URI,
  encodingType: this.camera.EncodingType.PNG,
  mediaType: this.camera.MediaType.PICTURE
};

getUser () {
  this.authService.currentUser.subscribe((user) => {
    this.user = user;
    console.log(this.user.profile.picture.data)
    // if(this.user.profile.picture.data == null){
    //   console.log("*******")
    //   this.profilePicValue == null
    // }else if(this.user.profile.picture.data == ''){
    //   this.profilePicValue == ''
    //   console.log("%%%%%%")

    // }else{
    //   this.profilePicValue == 'exists'
    //   console.log("#######")

    // }
    this.advisorUrl = user.profile.advisorUrl;
  });
}

isReadonly() {
  return this.isReadonl;   //return true/false 
}

myChange(){
  // console.log("Changed value");
  console.log(this.userForm.value.name)
}

async discontinueFinAdv(){
  console.log('discontinue ....');
  const alert = await this.alertCtrl.create({
      message: 'If you discontinue as a FINANCIAL ADVISOR, you will lose all your clients and access to their accounts. Do you still wish to proceed?',
           buttons:[ 
            {
          text: 'Yes, Delete',
          handler: () => {
            let updateAdvisor = {advisorName:'',isFinancialAdvisor:false,advisorCode:'',advisorUrl:'',email:this.user.email, isFinancialAdvisorClient:false}
            this.apiService.put('user/profile', {profile: updateAdvisor}).subscribe(async (data) => {
              console.log(data);
              this.user.profile = data;
              this.navService.navigateRoot('home')


                        // this.authService.setAuth(data);

            })
          }
        },
        {
          text: 'No',
          handler: () => {
          
          }
        }
      ]
  });
  await alert.present();
}

rmvAdvLog(){
  this.user.profile.advisorUrl = '';
  let rmvlog= {advisorUrl:'',advisorLogoName:''}
  this.apiService.put('user/profile', {profile: rmvlog}).subscribe(async (data) => {
  
    this.user.profile.advisorLogoName = data.advisorLogoName
    this.user.profile.advisorUrl = data.advisorUrl
    // console.log(data);
   
  })
}

togEvent(checkboxForFinAdvLink,checkboxForChangeToFinAdv){
  // console.log(checkboxForFinAdvLink,checkboxForChangeToFinAdv)

if(this.checkboxForFinAdvLink == true ){
  this.checkboxForChangeToFinAdv = false
}else if(this.checkboxForChangeToFinAdv == true){
  this.checkboxForFinAdvLink = false
}

}

togEvent1(checkboxForFinAdvLink,checkboxForChangeToFinAdv){

if(this.checkboxForChangeToFinAdv == true ){
  this.checkboxForFinAdvLink = false
}else if(this.checkboxForFinAdvLink == true){
  this.checkboxForChangeToFinAdv = false
}

}

makeAsFinancialAdvisor(){
  // this.presentAlert('A1004');
console.log(this.base64OfLogo)
  let updateAdvisor =
   {advisorName:this.user.profile.name,
    isFinancialAdvisor:true,
    email:this.user.email,
    advisorUrl:this.base64OfLogo,
    advisorLogoName:this.logoname,
    advisorOrgName:this.advOrgName}

      this.apiService.post('user/updateAdvisorCode', {profile: updateAdvisor}).subscribe(async (data) => {
        console.log(data);
        if(this.base64OfLogo != ''){
          this.uploadAdvisorLogo(this.base64OfLogo,data.profile.advisorCode)
        }
        this.presentAlert(data);
        
        // this.authService.presentToast('Registration Successfull!');
                // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
                //  this.navService.navigateRoot('/add-contacts');
      })
      
  // this.presentAlert(da);
}

async presentAlert (data) {
  const alert = await this.alertCtrl.create({
    header:data.profile.advisorCode,
    subHeader:'This is your unique Advisor Code for Durity.',
      message: 'You can share this code with your clients and ask them to to create their account in Durity using your Advisor code. This action will link their account to yours and will enable you to access your client\'s account.',
      buttons:[ 
            {
          text: 'OKAY',
          handler: () => {
          this.user.profile = data.profile
          this.updateDetails()

          // this.navService.navigateRoot('home')

          }
        }]
  });
  await alert.present();
}

changeLogo() {
  this.fileChooser.open()
                .then(
                    uri => {
                        this.filePath.resolveNativePath(uri)
                            .then(async (resolveFilePath) => {
                            //    this.loader = await this.loadingCtrl.create({
                            //     message: 'Uploading...'
                            // });
                            // (await this.loader).present();
                           
                               
                                // this.fileOpener.open(resolveFilePath, 'application/pdf').then(value => {
                                this.fileDir = resolveFilePath;
                                this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                                this.name = this.fileName; // alert('Selected Pdf file');
                                this.fileUrl = this.fileDir;
                                console.log(this.fileUrl);
                                console.log(this.name);
                                console.log(this.fileName);

                               let filePathBasedOnOs = this.fileUrl;
      const temp = filePathBasedOnOs.split("/");
      const nameFile = temp.pop();
      filePathBasedOnOs = decodeURI(temp.join("/") + "/");
      console.log(filePathBasedOnOs)
      this.logoname = this.fileName
      this.base64OfLogo = await this.readFileAsBase64Data(
        filePathBasedOnOs,
        this.name
      );
      // console.log(base64Data)
      // await this.uploadAdvisorLogo(base64Data)
      
    // this.loader.dismiss();
    // this.authService.currentUser.subscribe((data)=>{
    //   data.profile.advisorUrl = base64Data;
    // })
    // this.navService.navigateForword('/home');
      
     

                                // this.file.resolveLocalFilesystemUrl(uri).then((fileEntry: any) => {
                                //     fileEntry.file((fileObj) => {
                                //         let fileReader = new FileReader();
                                     
                                        // console.log(fileObj);
                                        // fileReader.onload = (e) => {
                                        //     this.fileChecksumValue = sha1(fileReader.result);
                                        // };
                                        // this.size = fileObj.size;
                                        // this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                                        // if (accessType === 'sign-up') {
                                        //     this.navService.navigateForword('/upload-document');
                                        // } else {
                                        //     this.navService.navigateForword('/upload-document');
                                        // }
                                    // });
                                // });
                            }).catch(err => {
                                // alert(JSON.stringify(err));
                                // this.alertDismissed();
                            });
                    });
}




uploadLogo() {

this.fileChooser.open()
.then(
    uri => {
        this.filePath.resolveNativePath(uri)
            .then(async (resolveFilePath) => {
               this.loader = await this.loadingCtrl.create({
                message: 'Uploading...'
            });
            (await this.loader).present();
           
               
                // this.fileOpener.open(resolveFilePath, 'application/pdf').then(value => {
                this.fileDir = resolveFilePath;
                this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                this.name = this.fileName; // alert('Selected Pdf file');
                this.fileUrl = this.fileDir;
                console.log(this.fileUrl);
                console.log(this.name);
                console.log(this.fileName);

               let filePathBasedOnOs = this.fileUrl;
const temp = filePathBasedOnOs.split("/");
const nameFile = temp.pop();
filePathBasedOnOs = decodeURI(temp.join("/") + "/");
console.log(filePathBasedOnOs)
this.logoname = this.fileName
this.base64OfLogo = await this.readFileAsBase64Data(
filePathBasedOnOs,
this.name
);
// console.log(base64Data)
await this.uploadAdvisorLogo(this.base64OfLogo,this.user.profile.advisorCode)

this.loader.dismiss();
this.authService.currentUser.subscribe((data)=>{
  data.profile.advisorUrl = this.base64OfLogo;
  data.profile.advisorLogoName = this.fileName
})
this.navService.navigateForword('/home');



                // this.file.resolveLocalFilesystemUrl(uri).then((fileEntry: any) => {
                //     fileEntry.file((fileObj) => {
                //         let fileReader = new FileReader();
                     
                        // console.log(fileObj);
                        // fileReader.onload = (e) => {
                        //     this.fileChecksumValue = sha1(fileReader.result);
                        // };
                        // this.size = fileObj.size;
                        // this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                        // if (accessType === 'sign-up') {
                        //     this.navService.navigateForword('/upload-document');
                        // } else {
                        //     this.navService.navigateForword('/upload-document');
                        // }
                    // });
                // });
            }).catch(err => {
                // alert(JSON.stringify(err));
                // this.alertDismissed();
            });
    });
}

uploadAdvisorLogo(base64Data,advcode){
 
  let postData = {
    advisorCode : advcode,
    advisorUrl : base64Data,
    advisorLogoName : this.logoname

  }
  this.apiService.post('user/uploadAdvisorLogo', { postData}).subscribe(async (data) => {
    console.log(data);
    this.user.profile.advisorLogoName = this.logoname
    this.user.profile.advisorUrl = base64Data

    // this.loadingCtrl.dismiss();
    



    // await modal.present();
    }, error => {
      if (error.status === 400) {
      } else {
      }
    });
}

public async readFileAsBase64Data(filePathBasedOnOs, filename) {
  let base4Data;
  await this.file
    .readAsDataURL(filePathBasedOnOs, filename)
    .then((fnBase64Data) => {
      base4Data = fnBase64Data;
      
    });
  return base4Data;
}

removeAdvLogo(){
  this.logoname = '';
  this.base64OfLogo = '';
}

async editProfile () {
  const modalController = await this.modalController.create({
    component: UpdateProfileComponent,
    backdropDismiss: false,
    showBackdrop: true,
    cssClass: 'custom-updatePopover'
  });
  await modalController.present();

}

async addAdvisor () {
  const modalController = await this.modalController.create({
    component: AddAdvisorComponent,
    backdropDismiss: false,
    showBackdrop: true,
    cssClass: 'custom-updatePopover'
  });
  await modalController.present();

}

public get profilePic () {
  return this.dom.bypassSecurityTrustUrl(`data:${this.user.profile.picture.contentType};base64,${this.user.profile.picture.data}`);

}

uploadProfilePic () {
  this.signUpWizardService.addPhoto ('profilePic');

}

goto (pageName, data?) {
  this.navService.goto(pageName, data);
}

updateProfileDetails(){
 
  if(this.user.profile.isFinancialAdvisor == false && this.user.profile.advisorCode == ''){
    if(this.checkboxForFinAdvLink == true){
      this.verifyAdvisor()
    }else if(this.checkboxForChangeToFinAdv == true){
      this.makeAsFinancialAdvisor() 
    }else{
      this.updateDetails()
    }
  }else{
    this.updateDetails()
  }

}

async updateDetails(){
  if(this.userForm.value.name != '' && this.userForm.value.telephoneNumber != '' ){
    console.log("^^^^^^^^")
    this.apiService.put('user/profile', {profile: this.userForm.value}).subscribe(async (data) => {
  
      if(this.user.profile.isFinancialAdvisor == true){
        this.user.profile.name = data.name
        this.user.profile.alternateEmailAddress = data.alternateEmailAddress
        this.user.profile.telephoneNumber = data.telephoneNumber
        this.user.profile.alternateTelephoneNumber = data.alternateTelephoneNumber
        this.user.profile.advisorOrgName = data.advisorOrgName
        this.navService.navigateRoot('home')
      }else{
        this.user.profile = data
        this.navService.navigateRoot('home')
        // this.navService.navigateForword('home')

      }
      console.log(data);
     
    });
      
  }
}

async verifyAdvisor(){
  if(this.enteredAdvCode != ''){

    this.loader = await this.loadingCtrl.create({
      message: 'Link...'
  });
  (await this.loader).present();


    this.apiService
    .post("user/verifyAdvisorCode", {
      enteredCode: this.enteredAdvCode,
    })
    .subscribe(async (data) => { 
      if(data != null){
        this.invalidAdvCode = '';
        this.updateAdvDetailsForUser(data)
      }else{
        this.loader.dismiss()
        this.invalidAdvCode = "*Invalid Code"
      }
    });
  }  else{
    
    this.invalidAdvCode = "*Enter Code"
  }
}

updateAdvDetailsForUser(advisorDetails){
  let updateAdvisor = {advisorName:advisorDetails.profile.name,advisorCode:advisorDetails.profile.advisorCode, advisorUrl:advisorDetails.profile.advisorUrl,isFinancialAdvisorClient:true}
  this.apiService.put('user/profile', {profile: updateAdvisor}).subscribe(async (data) => {
    this.user.profile = data
    this.globalVariablesProvider.isUserAclient == true
    this.loader.dismiss()
    this.updateDetails()
    // this.navService.navigateRoot('home')

  })
}

cancel () {
  this.navService.navigateRoot('/home');
}

async unlinkAdvisor(){
  const alert = await this.alertCtrl.create({
   
    subHeader:'Are you sure that you want to unlink from this Financial Advisor',
      buttons:[ 
            {
          text: 'Unlink',
          handler: () => {
            let updateAdvisor = {advisorName:'',advisorCode:'', advisorUrl:'',isFinancialAdvisorClient:false}
            this.apiService.put('user/profile', {profile: updateAdvisor}).subscribe(async (data) => {
              this.user.profile = data
              // this.loader.dismiss()
              this.navService.navigateRoot('home')
          
            })
          }
        },
        {
          text: 'No',
          handler: () => {
          
          }
        }]
  });
  await alert.present();
}


postProfilePic (image) {
   console.log(image);
   let updateAdvisor = {picture:{
     data : image
   }}
   this.apiService.put('user/profile', {profile: updateAdvisor}).subscribe(async (data) => {
    //  this.user.profile = data
     this.user.profile.picture.data = data.picture.data
     // this.loader.dismiss()
    //  this.navService.navigateRoot('home')
    
 
   })
    // this.isLoading = true;
    // this.apiService.profilePicUpload(image).subscribe(data => {
    //   console.log(data);
    // });
    // this.isLoading = false;
    // // this.apiService.getUserProfile(this.user._id).subscribe(ev => {
    // //   console.log(ev);
    // //   //this.profilePicImage = data.imageId
    // // });
  }
     captiureImage () {
  
      this.camera.getPicture(this.options).then( (imageData) => {
        
        Base64.encodeFile(imageData).then((base64File: string) => {
        let base64Image = base64File;
        base64Image = base64Image.split(',')[1];
        this.postProfilePic(base64Image);
        // base64Image = 'data:image/png;base64,' + base64Image;
        // this.profilePicImage = this.dom.bypassSecurityTrustUrl(base64Image);
        // console.log(this.profilePicImage);
      });
       
     }, (err) => {
      // Handle error
      console.log(err);
     });
  }
   imageFromGallery () {
  
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    };
    this.camera.getPicture(options).then( (imageData) => {
      this.isLoading = true;
      Base64.encodeFile(imageData).then((base64File: string) => {
        let base64Image = base64File;
        base64Image = base64Image.split(',')[1];
        this.postProfilePic(base64Image);
      });
      this.isLoading = false;
     }, (err) => {
      // Handle error
      console.log(err);
     });
  }

  removeProfilePic(){
    let profilePicdata = '';
    this.postProfilePic(profilePicdata);
  }

 
  
  async presentActionSheetforNewProfile () {
    this.isLoading = true;
    const actionSheet = await this.actionsheetCtrl.create({
      header: 'Profile photo',
      cssClass: 'my-custom-class',
      buttons: [
         {
        text: 'Camera',
        icon: 'assets/imgs/Camera Icon.svg',
        handler: () => {
          this.captiureImage();
        }
      }, {
        text: 'Gallery',
        icon: 'assets/imgs/Gallary Icon.svg',
        handler: () => {
          this.imageFromGallery();
        }
      },
    ]
    });
    await actionSheet.present();
    this.isLoading = false;
  }

  async presentActionSheetforChangeProfile () {
    this.isLoading = true;
    const actionSheet = await this.actionsheetCtrl.create({
      header: 'Profile photo',
      cssClass: 'my-custom-class',
      buttons: [
         {
        text: 'Camera',
        icon: 'assets/imgs/Camera Icon.svg',
        handler: () => {
          this.captiureImage();
        }
      }, {
        text: 'Gallery',
        icon: 'assets/imgs/Gallary Icon.svg',
        handler: () => {
          this.imageFromGallery();
        }
      },
      {
        text: 'Remove photo',
        icon: 'assets/imgs/Delete Icon.svg',
        handler: () => {
          this.removeProfilePic()
        }
      }]
    });
    await actionSheet.present();
    this.isLoading = false;
  }
  
}
