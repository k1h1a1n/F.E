import { Component, OnInit, Input } from "@angular/core";
import { NavigationService } from "@durity/services";
import { environment } from "src/environments/environment";
import { AuthService } from "src/app/services/auth.service";
import { AlertController, MenuController,ModalController } from "@ionic/angular";
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
  FormArray,
} from "@angular/forms";
import { ApiService } from "src/app/services/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

declare var RazorpayCheckout: any;

@Component({
  selector: "app-upgrade-plan",
  templateUrl: "./upgrade-plan.component.html",
  styleUrls: ["./upgrade-plan.component.scss"],
})
export class UpgradePlanComponent implements OnInit {
  apiUrl: string = environment.apiUrl;
  isProductionApi: boolean = environment.production;
  userDetails: any;
  alert: any;
  couponALert: any;
  paymentConfig: any;
  selectPlan: any = 0;
  selctPlanForm: FormGroup;
  userCurrentPlan: any;
  userEmail:any;
  userData:any;
  couponAlertSubheader:any = '';
  razorPayKey:any;
  aftervalidCpn:any;
  amountAftrCouponAppl:any;
  defaultDiamondPlan:any;
  diamondInputCouponValue:any = '';
  offerPercent:any;
  errMessage:any = '';
  applyEnabled:any = '';
  isHidden:boolean = true;


  planDetailsofGold: any;
  planNameGold: any;
  planActualAMountGold: any;
  planUsersGold: any;
  planFileSizeGold: any;
  planNoOfFilesGold: any;
  defaultPlatinumPlan:any;
  platinumInputCouponCode:any;
  offerPercentPlatinum:any;
  platinumErrMsg:any = '';
  applyPlatinumEnabled:any = '';
  isPlatinumReadOnly: boolean = false;
  planDetailsofPlatinum: any;
  planNamePlatinum: any;
  planActualAMountPlatinum: any;
  planAMountPlatinum: any;
  planUsersPlatinum: any;
  planFileSizePlatinum: any;
  planNoOfFilesPlatinum: any;
  isDiamondReadOnly: boolean = false;
  planDetailsofDiamond: any;
  planNameDiamond: any;
  planAMountDiamond: any;
  planActualAMountDiamond: any;
  planUsersDiamond: any;
  planFileSizeDiamond: any;
  planNoOfFilesDiamond: any;
  planActualAmountLTofDiamond: any;
  planAmountLTofDiamond: any;
  defaultDiamondPlansValue = '';
  @Input() value;
  constructor(
    private navService: NavigationService,
    public authService: AuthService,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private http: HttpClient,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
  ) {
    this.getPaymentConfigDetails();
    this.authService.currentUser.subscribe((user) => {
      this.userData = user;
      this.userEmail = user.email;
      this.userCurrentPlan = this.userData.userCurrentPlanDetails.planName;
    });
  }

  ionViewWillEnter() {
    this.getPaymentConfigDetails();
    this.menuCtrl.enable(true);
  }

  onChange (event) {
    console.log(event);
    this.defaultDiamondPlan = event;
    this.defaultDiamondPlansValue = event;
}
  selectPlanDiamond(xyz){
    console.log(xyz);
    this.defaultDiamondPlansValue = xyz;
    this.defaultDiamondPlan = xyz;
  }

  getPaymentConfigDetails() {
    this.http
      .get(`${this.apiUrl}/user/paymentConfigDetails`)
      .subscribe((res) => {
        this.paymentConfig = res;
        console.log(res);
        this.planActualAMountGold = this.paymentConfig.plansForUser.planGold.actualAmountPerYear;
        this.planDetailsofGold = this.paymentConfig.plansForUser.planGold;
        this.planNameGold = this.paymentConfig.plansForUser.planGold.planName;
        this.planUsersGold = this.paymentConfig.plansForUser.planGold.noOfUsers;
        this.planFileSizeGold = this.paymentConfig.plansForUser.planGold.fileSizeLimitInMB;
        this.planNoOfFilesGold = this.paymentConfig.plansForUser.planGold.noOfFilesToUpload;

        this.planActualAMountPlatinum = this.paymentConfig.plansForUser.planPlatinum.actualAmountPerYear;
        this.defaultPlatinumPlan = this.planActualAMountPlatinum;
        this.planDetailsofPlatinum = this.paymentConfig.plansForUser.planPlatinum;
        this.planNamePlatinum = this.paymentConfig.plansForUser.planPlatinum.planName;
        this.planUsersPlatinum = this.paymentConfig.plansForUser.planPlatinum.noOfUsers;
        this.planAMountPlatinum = this.paymentConfig.plansForUser.planPlatinum.planAmountPerYear;
        this.planFileSizePlatinum = this.paymentConfig.plansForUser.planPlatinum.fileSizeLimitInMB;
        this.planNoOfFilesPlatinum = this.paymentConfig.plansForUser.planPlatinum.noOfFilesToUpload;

        this.planActualAMountDiamond = this.paymentConfig.plansForUser.planDiamond.actualAmountPerYear;
        this.defaultDiamondPlan = this.planActualAMountDiamond;
        this.defaultDiamondPlansValue = this.planActualAMountDiamond;
        this.planDetailsofDiamond = this.paymentConfig.plansForUser.planDiamond;
        this.planNameDiamond = this.paymentConfig.plansForUser.planDiamond.planName;
        this.planAMountDiamond = this.paymentConfig.plansForUser.planDiamond.planAmountPerYear;
        this.planUsersDiamond = this.paymentConfig.plansForUser.planDiamond.noOfUsers;
        this.planFileSizeDiamond = this.paymentConfig.plansForUser.planDiamond.fileSizeLimitInMB;
        this.planNoOfFilesDiamond = this.paymentConfig.plansForUser.planDiamond.noOfFilesToUpload;
        this.planActualAmountLTofDiamond = this.paymentConfig.plansForUser.planDiamond.actualAmountPerLifeTime;
        this.planAmountLTofDiamond = this.paymentConfig.plansForUser.planDiamond.planAmountPerLifeTime;
        
        if(environment.production == true){
          this.razorPayKey = this.paymentConfig.plansForUser.razorpayLiveKey;
        }else{
          this.razorPayKey = this.paymentConfig.plansForUser.razorpayTestKey;
        }
      });

      this.authService.currentUser.subscribe((user) => {
        this.userData = user;
        this.userEmail = user.email;
        this.userCurrentPlan = this.userData.userCurrentPlanDetails.planName;
      });

      this.http
      .get(`${this.apiUrl}/user/getUserDetails?email=${this.userEmail}`)
      .subscribe((res) => {
        console.log(res);
      this.userDetails = res;
      this.userCurrentPlan = this.userDetails.userCurrentPlanDetails.planName;
      })
  }

  ngOnInit() {}

  goBack() {
    if (this.value == true) {
      this.modalCtrl.dismiss({
      });
    } else { 
      this.navService.navigateBack();
    }
  }

  goto(pageName: any, data?: any) {
    if(this.value == true){
      this.navService.navigateRoot('/home');
    } else{
     this.navService.goto(pageName, data);
    }
  }

  Coupon() {
    console.log("Applied Coupon");
  }

  // async presentAlert(planNameDiamond) {
  //   this.alert = await this.alertCtrl.create({
  //     cssClass: "customLoader",
  //     message: 'Select option ',
  //     inputs : [
  //     {
  //         type:'radio',
  //         label:this.planAMountDiamond,
  //         value:this.planAMountDiamond
  //     },
  //     {
  //         type:'radio',
  //         label:this.planAmountLTofDiamond,
  //         value:this.planAmountLTofDiamond
  //     }],
  //     buttons : [
  //     {
  //         text: "Cancel",
  //         handler: data => {
  //         console.log("cancel clicked");
  //         }
  //     },
  //     {
  //         text: "Submit",
  //         handler: data => { 
  //         if(data != undefined){
  //           this.validateCouponCode(data,planNameDiamond,this.planNoOfFilesDiamond,this.planFileSizeDiamond,this.planUsersDiamond);
  //         }
  //         }
  //     }]});
  //   await this.alert.present();
  // }

  // async presentAlert1(amount, planName, planNoOfFileSize, planFileSize, noOfUsers) {
  //   this.alert = await this.alertCtrl.create({
  //     cssClass: "customLoader",
  //     message: 'Coupon Applied Successfully',
  //     subHeader: 'Amount : ₹ '+amount,
     
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Pay',
  //         handler: () => {
  //          this.payWithRazorpay(amount, planName, planNoOfFileSize, planFileSize, noOfUsers)
  //           console.log('Buy clicked');

  //         }
  //       }
  //     ]});
  //   await this.alert.present();
  // }

  // async afterValidCouponAlert(amount, planName, planNoOfFileSize, planFileSize, noOfUsers){

  //   this.aftervalidCpn = this.alertCtrl.create({
  //     // title: 'Confirm purchase',
  //     // subHeader:'Amount : '+this.amountAftrCouponAppl,
  //     message: 'Coupon Applied Successfully',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Pay',
  //         handler: () => {
  //          this.payWithRazorpay(amount, planName, planNoOfFileSize, planFileSize, noOfUsers)
  //           console.log('Buy clicked');

  //         }
  //       }
  //     ]
  //   });
  //   this.aftervalidCpn.present();

  // }

  async validatePlatinumCoupon(enteredCoupon,amount){
    this.apiService
    .post("user/validateCouponCode", {
      couponCode: enteredCoupon,
      amount: amount,
    })
    .subscribe(async (response) => {
      
      if(response.statusCode == 400){
        console.log(response);
        this.applyPlatinumEnabled = "true";
        this.platinumErrMsg = "true";
        this.amountAftrCouponAppl = response.amountAfterAppliedCoupon;
        this.defaultPlatinumPlan = this.amountAftrCouponAppl;
        this.offerPercentPlatinum = response.offerPercent;

        // this.presentAlert1(this.amountAftrCouponAppl, planName, planNoOfFileSize, planFileSize, noOfUsers);
        // this.afterValidCouponAlert(response.amountAfterAppliedCoupon, planName, planNoOfFileSize, planFileSize, noOfUsers)
      }
      else{
        console.log("+++=", response);
        this.platinumErrMsg = "false";
        this.applyPlatinumEnabled = '';

      }
    });
  }

  async validateDiamondCoupon(enteredCoupon,amount){
    this.apiService
    .post("user/validateCouponCode", {
      couponCode: enteredCoupon,
      amount: amount,
    })
    .subscribe(async (response) => {
      
      if(response.statusCode == 400){
        console.log(response);
        this.applyEnabled = "true";
        this.errMessage = "true";
        this.amountAftrCouponAppl = response.amountAfterAppliedCoupon;
        this.defaultDiamondPlan = this.amountAftrCouponAppl;
        this.offerPercent = response.offerPercent;
        

        // this.presentAlert1(this.amountAftrCouponAppl, planName, planNoOfFileSize, planFileSize, noOfUsers);
        // this.afterValidCouponAlert(response.amountAfterAppliedCoupon, planName, planNoOfFileSize, planFileSize, noOfUsers)
      }
      else{
        console.log("+++=", response);
        this.errMessage = "false";
        this.applyEnabled = '';

      }
    });
  }

  // async validateCouponCode(amount, planName, planNoOfFileSize, planFileSize, noOfUsers){  
  //   this.couponALert = await this.alertCtrl.create({
  //     // message: 'Login',
  //     subHeader:this.couponAlertSubheader,
  //     inputs: [
  //       {
  //         name: 'coupon',
  //         placeholder: 'Coupon Code'
  //       },
        
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Apply',
  //         handler: data => {
  //           console.log(data.coupon);
  //           this.apiService
  //     .post("user/validateCouponCode", {
  //       couponCode: data.coupon,
  //       amount: amount,
  //     })
  //     .subscribe(async (response) => {
        
  //       if(response.statusCode == 400){
  //         console.log(response);
  //         this.amountAftrCouponAppl = response.amountAfterAppliedCoupon;
  //         this.presentAlert1(this.amountAftrCouponAppl, planName, planNoOfFileSize, planFileSize, noOfUsers);
  //         // this.afterValidCouponAlert(response.amountAfterAppliedCoupon, planName, planNoOfFileSize, planFileSize, noOfUsers)
  //       }
  //       else{
  //         console.log("+++=", response);

  //       }
  //     });
  //           // let abc = true;
  //           // if (!abc) {
  //           //   console.log('****');
  //           //   // logged in!
  //           // } else {
  //           //   console.log('%%%%%');
  //           //   // invalid login
  //           //   return this.presentAlert(this.planNameDiamond);
  //           // }
  //         }
  //       }
  //     ]
  //   });
  //   this.couponALert.present();
  // }

  async payWithRazorpay(amount, planName, planNoOfFileSize, planFileSize, noOfUsers, couponUsed) {
    if(typeof(amount) != 'string' ){
      var amountToPay = amount;
    }else{
       amountToPay = amount.replace(',', '');
    }
    var options = {
      description: "Credits towards consultation",
      image: "https://i.imgur.com/3g7nmJC.png",
      currency: this.userDetails.userCurrentPlanDetails.currency, // your 3 letter currency code
      key: this.razorPayKey, // your Key Id from Razorpay dashboard
      amount: amountToPay * 100, // Payment amount in smallest denomiation e.g. cents for USD
      name: "Razorpay",
      prefill: {
        email: this.userDetails.email,
        contact: this.userDetails.profile.telephoneNumber,
        name: "Razorpay",
      },
      theme: {
        color: "#F37254",
      },
      modal: {
        ondismiss: function () {
          alert("dismissed");
        },
      },
    };

    var successCallback =  (payment_id) => {
      alert("Payment Successful");
      this.updateUserCurrentPlanApiCall(planName,amount,payment_id,planNoOfFileSize, planFileSize, noOfUsers, couponUsed);
     this.authService.currentUser.subscribe((user) => (
       user.userCurrentPlanDetails.planName = planName
     ))
      this.navService.goto('home');
     
      
      // this.updateUserCurrentPlanApiCall(plan,amount,payment_id);
    };

    var cancelCallback = function (error) {
      alert(error.description + " (Error " + error.code + ")");
    };

    await RazorpayCheckout.open(options, successCallback, cancelCallback);
      
  }

  updateUserCurrentPlanApiCall(planName, amount, payment_id,planNoOfFile, planFileSize, noOfUsers, couponUsed) {
    if(couponUsed == undefined || couponUsed == null || couponUsed == ''){
     var couponCodeUsedByUser = '';
    }else{
      couponCodeUsedByUser = couponUsed;
    }
    let userChangedPlanDetails: any = {
      email: this.userEmail,
      planName: planName,
      amountPaid: amount,
      couponCode: couponUsed,
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
  editPlatinumCupon () {
    this.applyPlatinumEnabled = '';
    this.defaultPlatinumPlan = this.planActualAMountPlatinum;
    // this.isPlatinumReadOnly = false;
  }
  editDiamondCupon() {
    this.applyEnabled = '';
    this.defaultDiamondPlan = this.defaultDiamondPlansValue;
    // this.isDiamondReadOnly = false;
  }
}
