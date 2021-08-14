import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController, Events } from '@ionic/angular';
import { ToastComponent } from '../toast/toast.component';
import { FeedbackSubmitComponent } from '../feedback-submit/feedback-submit.component';
import { ProfileSubmitComponent } from '../profile-submit/profile-submit.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { timeStamp } from 'console';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-add-advisor',
  templateUrl: './add-advisor.component.html',
  styleUrls: ['./add-advisor.component.scss'],
})
export class AddAdvisorComponent implements OnInit {
  apiUrl: string = environment.apiUrl;
  user: any;
  userId: string;
  token: string;
  advisorForm: FormGroup;
  header: HttpHeaders;
  advisorData: any;
  advisorPlan: String;
  advisorName: String;
  paymentConfig: any;
  userEmail: any;
  isVerified: boolean = true;


  planDetailsofGold: any;
  planNameGold: any;
  planActualAMountGold: any;
  planUsersGold: any;
  planFileSizeGold: any;
  planNoOfFilesGold: any;

  planDetailsofPlatinum: any;
  planNamePlatinum: any;
  planActualAMountPlatinum: any;
  planAMountPlatinum: any;
  planUsersPlatinum: any;
  planFileSizePlatinum: any;
  planNoOfFilesPlatinum: any;

  planDetailsofDiamond: any;
  planNameDiamond: any;
  planAMountDiamond: any;
  planActualAMountDiamond: any;
  planUsersDiamond: any;
  planFileSizeDiamond: any;
  planNoOfFilesDiamond: any;
  planActualAmountLTofDiamond: any;
  planAmountLTofDiamond: any;

  ngOnInit () {

  }

  constructor (
               private authService: AuthService,
               private apiService: ApiService,
               private fb: FormBuilder,
               public popoverController: PopoverController,
               private modalCtrl: ModalController,
               public events: Events,
               private http: HttpClient
               ) {
                this.getUser ();
                this.getPaymentConfigDetails()

                this.advisorForm = this.fb.group({
                advisorName : new FormControl(this.user.profile.advisorName),
                advisorCode : new FormControl(this.user.profile.advisorCode),
                advisorUrl : new FormControl(this.user.profile.advisorUrl)

      });
    }

    getUser () {
      this.authService.currentUser.subscribe((user) => {
        this.user = user;
        this.userId = user._id;
        this.userEmail = user.email;
        this.token = user.token;
      });
      this.header = new HttpHeaders({
        'content-type': 'application/json',
        Authorization: this.token,
    });
    }

  async updateProfile () {
    this.isVerified = true;
    this.apiService.put('user/profile', {profile: this.advisorForm.value}).subscribe(async (data) => {
      console.log(data);
      this.events.publish('advisorUrl',data);

      this.authService.currentUser.subscribe((user) => {
        // user.profile.name = res.profile.name,
        // user.profile.alternateEmailAddress = res.profile.alternateEmailAddress,
        // user.profile.alternateTelephoneNumber = res.profile.alternateTelephoneNumber,
        // user.profile.telephoneNumber = res.profile.telephoneNumber
        user.profile.advisorCode = data.advisorCode,
        user.profile.advisorName = data.advisorName,
        user.profile.advisorUrl = data.advisorUrl
      });
    //   this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
    //     // this.authService.setAuth(res);
    //     console.log(res);
    //     // let data = JSON.stringify( res);
    //     this.authService.currentUser.subscribe((user) => {
    //       // user.profile.name = res.profile.name,
    //       // user.profile.alternateEmailAddress = res.profile.alternateEmailAddress,
    //       // user.profile.alternateTelephoneNumber = res.profile.alternateTelephoneNumber,
    //       // user.profile.telephoneNumber = res.profile.telephoneNumber
    //       user.profile = data.profile,
    //       user.profile.advisorName = res.profile.advisorName
    //     });
    //     // user.profile.name = selectClient.profile.name,
    // });
      this.modalCtrl.dismiss();
      const modal = await this.modalCtrl.create({
      component: ToastComponent,
      cssClass: 'simple-delete-modal',
      componentProps: { updateProfile: 'updateProfile' }
    });
      await modal.present();
      }, error => {
        if (error.status === 400) {
        } else {
        }
      });
      }

 async submitForm () {
      console.log(this.advisorForm.value.advisorCode)
      if(this.advisorForm.value.advisorCode !== "")
      {
         this.http.get(`${this.apiUrl}/user/sendAdvisorDetails/${this.advisorForm.value.advisorCode}`)
         .subscribe(async (res)=>{
           console.log(res);
           this.advisorData = res;
           if(this.advisorData == null)
           {
              this.isVerified = false;
              return
           }
           else{
             this.advisorForm.value.advisorName = this.advisorData.profile.name;
             this.advisorForm.value.advisorUrl = this.advisorData.profile.advisorUrl;
             this.advisorPlan = this.advisorData.advisorPlan;
             if(this.advisorPlan == this.planNameGold){
              this.updateUserCurrentPlanApiCall(this.planNameGold,0,"",this.planNoOfFilesGold,this.planFileSizeGold,this.planUsersGold);
             }
             else if(this.advisorPlan == this.planNameDiamond){
              this.updateUserCurrentPlanApiCall(this.planNameDiamond,0,"",this.planNoOfFilesDiamond,this.planFileSizeDiamond,this.planUsersDiamond);
             }
             else if(this.advisorPlan == this.planNamePlatinum){
                this.updateUserCurrentPlanApiCall(this.planNamePlatinum,0,"",this.planNoOfFilesPlatinum,this.planFileSizePlatinum,this.planUsersPlatinum);
             }
             this.updateProfile();
           }
         });
         
      }
      else{
        this.isVerified = false;
       return
      }
    }


    cancel () {
      this.modalCtrl.dismiss();
    }

    getPaymentConfigDetails() {
      this.http
        .get(`${this.apiUrl}/user/paymentConfigDetails`)
        .subscribe((res) => {
          this.paymentConfig = res;
          this.planActualAMountGold = this.paymentConfig.plansForUser.planGold.actualAmountPerYear;
          this.planDetailsofGold = this.paymentConfig.plansForUser.planGold;
          this.planNameGold = this.paymentConfig.plansForUser.planGold.planName;
          this.planUsersGold = this.paymentConfig.plansForUser.planGold.noOfUsers;
          this.planFileSizeGold = this.paymentConfig.plansForUser.planGold.fileSizeLimitInMB;
          this.planNoOfFilesGold = this.paymentConfig.plansForUser.planGold.noOfFilesToUpload;
  
          this.planActualAMountPlatinum = this.paymentConfig.plansForUser.planPlatinum.actualAmountPerYear;
          this.planDetailsofPlatinum = this.paymentConfig.plansForUser.planPlatinum;
          this.planNamePlatinum = this.paymentConfig.plansForUser.planPlatinum.planName;
          this.planUsersPlatinum = this.paymentConfig.plansForUser.planPlatinum.noOfUsers;
          this.planAMountPlatinum = this.paymentConfig.plansForUser.planPlatinum.planAmountPerYear;
          this.planFileSizePlatinum = this.paymentConfig.plansForUser.planPlatinum.fileSizeLimitInMB;
          this.planNoOfFilesPlatinum = this.paymentConfig.plansForUser.planPlatinum.noOfFilesToUpload;
  
          this.planActualAMountDiamond = this.paymentConfig.plansForUser.planDiamond.actualAmountPerYear;
          this.planDetailsofDiamond = this.paymentConfig.plansForUser.planDiamond;
          this.planNameDiamond = this.paymentConfig.plansForUser.planDiamond.planName;
          this.planAMountDiamond = this.paymentConfig.plansForUser.planDiamond.planAmountPerYear;
          this.planUsersDiamond = this.paymentConfig.plansForUser.planDiamond.noOfUsers;
          this.planFileSizeDiamond = this.paymentConfig.plansForUser.planDiamond.fileSizeLimitInMB;
          this.planNoOfFilesDiamond = this.paymentConfig.plansForUser.planDiamond.noOfFilesToUpload;
          this.planActualAmountLTofDiamond = this.paymentConfig.plansForUser.planDiamond.actualAmountPerLifeTime;
          this.planAmountLTofDiamond = this.paymentConfig.plansForUser.planDiamond.planAmountPerLifeTime;
        });
      }

 updateUserCurrentPlanApiCall(planName, amount, payment_id,planNoOfFile, planFileSize, noOfUsers) {
    let userChangedPlanDetails: any = {
      email: this.userEmail,
      planName: planName,
      amountPaid: amount,
      paymentId: payment_id,
      planNoOfFile: planNoOfFile,
      planFileSize: planFileSize,
      noOfUsers: noOfUsers,
      actualAmount: "",
      offerAmount: "",
      couponUsed: "",
    };
    this.apiService
      .post("user/upgradePlanAndPayment", {
        userCurrentPlanDetails: userChangedPlanDetails,
      })
      .subscribe(async (data) => {
        return data;
      });
  }

}
