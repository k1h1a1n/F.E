import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoadingController, ModalController} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {ChooseSingleContactComponent} from '../choose-single-contact/choose-single-contact.component'



@Component({
  selector: 'app-add-newclient-for-advisor',
  templateUrl: './add-newclient-for-advisor.component.html',
  styleUrls: ['./add-newclient-for-advisor.component.scss'],
})
export class AddNewclientForAdvisorComponent implements OnInit {
  userForm: FormGroup;
  advisorDetails: any;
  enableOtp: boolean = false;
  otpForm: FormGroup;
  time: BehaviorSubject<string>=new BehaviorSubject('00:00');
     interval
  timer: number;
  header: HttpHeaders;
  public phone: string;


  constructor(
    private navService: NavigationService,
    public formBuilder: FormBuilder,
    public loaderCtrl: LoadingController,
    private authService: AuthService,
    private otpformBuilder: FormBuilder,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    


  ) { 
    this.header = new HttpHeaders({
      'content-type': 'application/json'
  });
    this.authService.currentUser.subscribe((user) => {
      this.advisorDetails = user;
    });
    this.userForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose( [Validators.required])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phoneNumber: new FormControl('', Validators.compose( [ Validators.required, Validators.maxLength(15),Validators.minLength(10),
        Validators.pattern(String.raw`^[0-9]*$`)]))
  });
    this.otpForm = this.otpformBuilder.group({
    otpEntered:['',[Validators.required]]
  });
  }

  ngOnInit() {}

  goBack(){
    this.navService.navigateBack ();
  }

  async onSubmit(){
    console.log(this.userForm.value);
    if ( this.userForm.valid) {
      // console.log("***********")
      this.enableOtp = true;
      
      // Object.keys(this.userForm.controls).forEach((key) =>
      // this.userForm.get(key).setValue(this.userForm.get(key).value.trim()));
      let mobNum = {mobileNumber: this.userForm.value.phoneNumber};
      console.log(mobNum)
      this.http.post(`${environment.apiUrl}/user/sendOTPforUserAuth`, mobNum,{ headers: this.header }).subscribe(async (data1) => {
        console.log(data1)
      }), (error: any) => {};
      this.startTimer(5)
  }
  }

  backBtn(){
    this.enableOtp = false;
  }

  startTimer(duration: number){
    clearInterval(this.interval);
    this.timer = duration*60;
    this.updateTimeValue();
    this.interval=setInterval(()=>{
      this.updateTimeValue();
    },1000);
    }
  
  stopTimer(){
    clearInterval(this.interval);
    this.time.next('00:00');
  }
  
  
  updateTimeValue() {
    let minutes: any = this.timer /60;
    let seconds: any= this.timer %60;
  
    minutes= String('0'+Math.floor(minutes)).slice(-2);
    seconds= String('0'+Math.floor(seconds)).slice(-2);
  
    const text=minutes+ ':'+ seconds;
    this.time.next(text);
  
    --this.timer;
  }

 async makeRegistration(){

  const afterOTPloader = await this.loadingCtrl.create({
    message: 'Verifying OTP...'
});
(await afterOTPloader).present();
    // console.log("entered code : ",this.enteredCode)
    let mobNum = {  mobileNumber: this.userForm.value.phoneNumber, otp: this.otpForm.value.otpEntered };
    
    await this.http.post(`${environment.apiUrl}/user/verifyOTPforUserAuth`,mobNum ,{ headers: this.header }).subscribe(async (data) => {
     await this.loadingCtrl.dismiss();
      console.log(data);
      console.log(data['status'])
      if(data['response'].message == 'success'){}})



    const loader = await this.loaderCtrl.create({
      message: 'Please wait...'
  });
  (await loader).present();

  const credentials = {
      name : this.userForm.value.name,
      email: this.userForm.value.email,
      telephoneNumber: this.userForm.value.phoneNumber ,
      password: "12345678",
      isUserAnAdvisor: false,
      advisorCode:this.advisorDetails.profile.advisorCode,
      advisorName:this.advisorDetails.profile.advisorName,
      advisorUrl:this.advisorDetails.profile.advisorUrl,
      createdByAdvisor: true

            };
  this.authService.attemptAuth('addClient', credentials).then(res => {
         this.loaderCtrl.dismiss();
        //  this.navService.goto('home');
        this.navService.navigateForword('/home');
     
     }).catch(err => {
         this.loaderCtrl.dismiss();
         this.authService.presentToast('Error in Registering, Please try after sometime');
     });
  }

  async navigate () {
    this.userForm.reset();
    const modal = await this.modalCtrl.create({
      component: ChooseSingleContactComponent,
      componentProps: {
      }
  });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);
    console.log(data.selectedContacts);
    console.log(data.selectedContacts[0].selectedContactName);
    console.log(data.selectedContacts[0].selectedContactNumberOne);
    console.log(data.selectedContacts[0].primaryEmail);
    this.userForm.get('name').setValue(data.selectedContacts[0].selectedContactName);
    this.phone = data.selectedContacts[0].selectedContactNumberOne;
    const res = this.phone.substring(3, 13);
    this.userForm.get('phoneNumber').setValue(res);
    this.userForm.get('email').setValue(data.selectedContacts[0].primaryEmail[0].value);



   /*  this.createdContacts = data;
    this.contactData = {
       firstName : data.firstName,
       mobilePhone: data.mobilePhone,
       relationship: data.relationship 
   };*/

  }
}
