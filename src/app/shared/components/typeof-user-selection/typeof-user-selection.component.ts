import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from '@durity/services';
import { PopoverOnTypeofUserComponent } from '../popover-on-typeof-user/popover-on-typeof-user.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-typeof-user-selection',
  templateUrl: './typeof-user-selection.component.html',
  styleUrls: ['./typeof-user-selection.component.scss'],
})
export class TypeofUserSelectionComponent implements OnInit {
  cardOne = false;
  cardTwo = false;
  cardthree = true;
    userDetails: any;
  cardNumber: any = '3';
  enteredCode:any = '';
  warningMag:any = '';
  showWarningMsg:boolean = false;
  verifiedCode : boolean = false;
  showwrongCodeMsg: boolean = false;
  wrongCodeMsg:any = '';
  correctCodeMsg:any = '';
  showCorrectCode:boolean = false;
  advisorDetails:any;
  public item2BackgroundSet = false;
  finAdvText : any = '*Verification Required';
  newDurText: any = '*If you are not associated with any Advisor';

  constructor(
    public authService: AuthService,
    public apiService: ApiService,
    public navService: NavigationService,
    public popOverCtrl:PopoverController
  ) {
    this.authService.currentUser.subscribe((user) => {
      this.userDetails = user;
   
    });
   }

  ngOnInit() {}

 
  verifyAdvisor(){
console.log(this.enteredCode)
if(this.enteredCode == ''){
  this.showWarningMsg = true
  this.warningMag = "Please enter code"
}else{
  this.showWarningMsg = false

  this.apiService
  .post("user/verifyAdvisorCode", {
    enteredCode: this.enteredCode,
  })
  .subscribe(async (data) => {
    if(data != null){
      this.showCorrectCode = true
      this.correctCodeMsg = data.profile.name
      this.advisorDetails = data
      this.showwrongCodeMsg = false
      this.showWarningMsg = false

    }else{
      this.showWarningMsg = false

      this.showwrongCodeMsg = true
      this.wrongCodeMsg = 'Invalid Code'
      this.showCorrectCode = false
    }

    // return data;
  });
}
  }

  choosedCard(cardNumber){
    this.cardNumber = cardNumber;
    if(this.cardNumber == '1'){
      this.finAdvText = '*We will contact you for a short verification process'
      this.newDurText = ''
      this.cardOne = true;
      this.cardTwo = false;
      this.cardthree = false;
    }
    else if(this.cardNumber == '2'){
      this.newDurText = ''
      this.finAdvText = '*Verification Required'
      this.cardOne = false;
      this.cardTwo = true;
      this.cardthree = false;
      this.item2BackgroundSet = !this.item2BackgroundSet; 
      console.log(this.item2BackgroundSet);
    }
    else if(this.cardNumber == '3'){
      this.newDurText = '*If you are not associated with any Advisor';
      this.finAdvText = '*Verification Required'
      this.cardOne = false;
      this.cardTwo = false;
      this.cardthree = true;
    }
  }

  onSubmit(){
    if(this.cardNumber == '1'){
      let updateAdvisor = {advisorName:this.userDetails.profile.name,isFinancialAdvisor:true,email:this.userDetails.email,advisorUrl:'',advisorLogoName:'',advisorOrgName:''}
      this.apiService.post('user/updateAdvisorCode', {profile: updateAdvisor}).subscribe(async (data) => {
        this.authService.presentToast('Registration Successfull!');
                // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
                 this.navService.navigateRoot('/add-contacts');
      })
    }
    else if(this.cardNumber == '2'){
      if(this.enteredCode == ''){
        this.showWarningMsg = true
        this.warningMag = "Please enter code"
      }else{
        if(this.showCorrectCode == true){
          let updateAdvisor = {advisorName:this.advisorDetails.profile.name,advisorCode:this.advisorDetails.profile.advisorCode, advisorUrl:this.advisorDetails.profile.advisorUrl}
      this.apiService.put('user/profile', {profile: updateAdvisor}).subscribe(async (data) => {
        this.authService.presentToast('Registration Successfull!');
                // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
                 this.navService.navigateRoot('/add-contacts');
      })
        }else{
          this.showWarningMsg = true
          this.warningMag = "Please enter Valid code"
        }
        
      }
    }
    else if(this.cardNumber == '3'){
  this.authService.presentToast('Registration Successfull!');
                // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
                 this.navService.navigateRoot('/add-contacts');
    }
  }

  async showPopoverForTypeOfUser(){
    const popover = await this.popOverCtrl.create({
      component: PopoverOnTypeofUserComponent,
      cssClass: 'typeofUser-popover',
      // backdropDismiss: false,
      });
    return await popover.present();
  }

}
