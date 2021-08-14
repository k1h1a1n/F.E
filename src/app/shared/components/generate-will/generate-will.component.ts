import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { AuthService } from 'src/app/services/auth.service';
import { Validators, FormBuilder, FormGroup, AbstractControl, FormArray,FormControl } from '@angular/forms';
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/services/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AlertController, PopoverController, LoadingController } from '@ionic/angular';
import { EncryptionPopoverComponent } from '../signup-wizard/encryption-popover/encryption-popover.component';
import { WillDisclaimerComponent } from '../enter-file-download-otp/enter-file-download-otp.component';
import { DownloadDocumentService } from '../../services/download-document.service';
import { WillDownloadAlertComponent } from '../will-download-alert/will-download-alert.component';
import {UpgradePopoverComponent} from '../upgrade-popover/upgrade-popover.component';
import { kMaxLength } from 'buffer';
@Component({
  selector: 'app-generate-will',
  templateUrl: './generate-will.component.html',
  styleUrls: ['./generate-will.component.scss'],
})
export class GenerateWillComponent implements OnInit {

  willGenerateForm1: FormGroup;
  willGenerateForm2: FormGroup;
  willGenerateForm3: FormGroup;
  willGenerateForm4: FormGroup;
  willGenerateForm5: FormGroup;
  
  

  Childrens: FormArray;
  
  apiUrl = environment.apiUrl;
  userId: any;
  token: any;
  header: any;
  attachments: any;
  dateByName: any = ' ';
  editedWill: boolean = false;
  equateToSpouse: any;
  setItem: any = '';
  userAadharId:any = '';
  benefAadharId:any = '';
  userGenderForm:any = 'his';
  userGenderTerm:any = 'himself';
  /*Rakesh*/
  Beneficiary: FormArray;
  willGenerateFormArray: FormArray;
  planName: any = '';
  distribute: any;
  value: any = 'Asset Distribution';

  assets = ['Artwork', 'Bank accounts','Bonds',  'Building', 'Bungalow','Business','Cash','Copy rights',
  'Demat Account','Flat','Furniture', 'Gold','Gratuity', 'Insurance Policy', 'Intellectual Property','Mutual Fund' ,'Plot of Land','Public Provident Fund','Safe Deposit Locker','Shop','Vehicle','Warehouse','Jewellery','Other'];

  relations = ['Spouse', 'Parent', 'Sister', 'Brother', 'Niece', 'Nephew', 'Son', 'Daughter',
                    'Aunt', 'Uncle', 'Brother-in-law', 'Sister-in-law', 'Cousin', 'Grand Parent','Other'];
  annexure =  false;
  isSubmitted: any;
  dates: any;
  months: number;
  year: number;
  day: number;
  nameOftheMonth: string;
  addChild (): FormGroup {
    return this.formBuilder.group({
      ChildName: '',
      DateOfBirth: '',
      DoB: ''
    });

  }
  addForm3Child (): FormGroup {
    return this.formBuilder.group({
      name:['', [Validators.required]],
      relation: ['',[Validators.required]],
      percentage:['',[Validators.required]],
    }  );
  }
  addForm (): FormGroup{
    return this.formBuilder.group({
      typeOfAsset : ['',[Validators.required]],
      assetDetails: new FormControl('',Validators.required),
      rupees_percent: ['true'],
      Beneficiary: this.formBuilder.array([this.addForm3Child()])
    });
  }
  
 



  constructor(
   
    private navService: NavigationService,
    private authService: AuthService,
    private apiService: ApiService,
    private alertCtrl: AlertController,
    public popoverController: PopoverController,
    private popOverCtrl: PopoverController,
    private downloadDocumentService: DownloadDocumentService,
    public loadingCtrl: LoadingController,

    private http: HttpClient,
    private formBuilder: FormBuilder){
     

       
      this.willGenerateForm1 = this.formBuilder.group({
        fullName: ['', [
          Validators.required,
         
        ]],
        parentDetailRel:['S/o', [
          Validators.required
        ]],
        parentDetailIfLate:['empty', [
          Validators.required
        ]],
        parentDetailPrefix:['Mr', [
          Validators.required
        ]],
        parentDetailName:['', [
          Validators.required,
         
        ]],
        dateOfBirth:['',           
      ],
      familyDetailCity:['', [
        Validators.required
      ]],
      idType:[''],
      idNumber:[''],    
       });      

      this.willGenerateForm2 = this.formBuilder.group({
        // familyDetailCity:['', [
        //   Validators.required
        // ]],
        // idType:[''],
        // idNumber:[''],
        familyDetailSpouseName:['', [
          Validators.required,
          
        ]],
        familyDetailHaveKids:['false', [
          Validators.required
        ]],
        Childrens: this.formBuilder.array([this.addChild()]),
        assets_dist: ['true', [Validators.required]],

        beneficiaryName:['', [
          Validators.required
        ]],
        beneficiaryDateOfBirth:['', [Validators.pattern('[0-9]{2}/[0-9]{2}/[1-2]{1}[0-9]{3}')]],
       beneficiaryRel:['spouse', [
          Validators.required
        ]],
        beneficiaryIdType:[''],
        beneficiaryIdNumber:['']
      });

      this.willGenerateForm3 = this.formBuilder.group({
        willGenerateFormArray: this.formBuilder.array([this.addForm()]),
       });
     

      this.willGenerateForm4 = this.formBuilder.group({
        executorName:['', [
          Validators.required,
        ]],
        executorRel:[''],
        executorRelOther:[''],
        executorCity:[''],
        altExecutorName:[''],
        altExecutorRel:[''],
        altExecutorRelOther:[''],
        altExecutorCity:['']
      });
      this.willGenerateForm5 = this.formBuilder.group({
        guardianName:[''],
        guardianRel:[''],
        guardianRelOther:[''],
        guardianCity:[''],
        altGuardianName:[''],
        altGuardianRel:[''],
        altGuardianRelOther:[''],
        altGuardianCity:[''],
      });

      this.authService.currentUser.subscribe((user) => {
        this.userId = user._id;
        this.token = user.token;
      });
      // this.getAttachments();

      this.userData = this.authService.currentUser.subscribe(user => 
      ( this.userName = user.profile.name,
        this.userDetails = user
      )
      );
     
      
      this.http
    .get(`${this.apiUrl}/user/getUserDetails?email=${this.userDetails.email}`)
    .subscribe((res) => {
    console.log('&&&',res);
    this.userDetails = res;
    console.log('18111111111' + this.userDetails);
    this.authService.currentUser.subscribe((info) => {
      this.planName = info.userCurrentPlanDetails.planName;
    });

    // this.planName = this.userDetails.userCurrentPlanDetails.planName;
    console.log(this.planName);
    // this.planName = 'platinum';
    // this.planName = 'GOLD';
    this.userName = this.userDetails.willFormDetails.userFullName;

    if(this.userDetails.willFormDetails.editedWill == true){
      

    if(this.userDetails.willFormDetails.saveWillFormDetails == true){
      this.saveFormData = true;
      // this.saveFormDataFunc('yes');
    }
    if(this.userDetails.willFormDetails.userParentDetails.liveStatus == ''){
      this.willGenerateForm1.get('parentDetailIfLate').setValue("empty");
    }else{
      this.willGenerateForm1.get('parentDetailIfLate').setValue(this.userDetails.willFormDetails.userParentDetails.liveStatus);
    }
    // this.willGenerateForm1.get('saveFormData').setValue(this.userDetails.willFormDetails.saveWillFormDetails);
    this.willGenerateForm1.get('fullName').setValue(this.userDetails.willFormDetails.userFullName);
    this.willGenerateForm1.get('parentDetailRel').setValue(this.userDetails.willFormDetails.userParentDetails.relation);
    this.willGenerateForm1.get('parentDetailPrefix').setValue(this.userDetails.willFormDetails.userParentDetails.prefixStatus);
    this.willGenerateForm1.get('parentDetailName').setValue(this.userDetails.willFormDetails.userParentDetails.parentName);
    this.willGenerateForm1.get('dateOfBirth').setValue(this.userDetails.willFormDetails.UserDoBOriginalFormat);
    console.log('spousename',this.userDetails.willFormDetails.familyDetails.spouseName)
    this.equateToSpouse = this.userDetails.willFormDetails.familyDetails.spouseName;
    this.willGenerateForm1.get('familyDetailCity').setValue(this.userDetails.willFormDetails.familyDetails.residingCity);
    this.willGenerateForm2.get('familyDetailSpouseName').setValue(this.userDetails.willFormDetails.familyDetails.spouseName);
    this.willGenerateForm2.get('familyDetailHaveKids').setValue(this.userDetails.willFormDetails.familyDetails.kidsStatus);
    this.willGenerateForm1.get('idType').setValue(this.userDetails.willFormDetails.idType);
    console.log(this.userDetails.willFormDetails.idType);
    if(this.userDetails.willFormDetails.idType == "Aadhar ID" || this.userDetails.willFormDetails.idType == ""){
      this.userAadharId = '';
    }else{
      this.userAadharId = 'Pan';
    }
    console.log(this.userAadharId);

    this.willGenerateForm1.get('idNumber').setValue(this.userDetails.willFormDetails.idCardNumber);
    if(this.userDetails.willFormDetails.familyDetails.Childrens.length > 1){
      for (let i = 0; i < this.userDetails.willFormDetails.familyDetails.Childrens.length-1 ; i++) {
        this.addMore();
        // this.Childrens.push(this.userDetails.willFormDetails.familyDetails.Childrens[i]);
        // this.willGenerateForm2.get('Childrens.ChildName').setValue(this.userDetails.willFormDetails.familyDetails.Childrens[i]['ChildName']);
      }
    }
  
    // this.willGenerateForm2.get('Childrens').push(this.userDetails.willFormDetails.familyDetails.Childrens);
    this.willGenerateForm2.patchValue({
       Childrens:this.userDetails.willFormDetails.familyDetails.Childrens
    })
      // let employeeFormGroups =  this.formBuilder.group(this.userDetails.willFormDetails.familyDetails.Childrens);
      //     let employeeFormArray = this.formBuilder.array(employeeFormGroups[1]);
      //     this.willGenerateForm2.setControl('Childrens', employeeFormArray);
      // this.willGenerateForm2.patchValue('Childrens')
      // (<FormArray>this.willGenerateForm2.controls['Childrens']).at(1).patchValue(this.userDetails.willFormDetails.familyDetails.Childrens);
      // this.willGenerateForm2.setControl('Childrens',this.formBuilder.array(this.userDetails.willFormDetails.familyDetails.Childrens));
      // this.willGenerateForm2.get('Childrens').setValue(this.userDetails.willFormDetails.familyDetails.Childrens);

    this.willGenerateForm2.get('beneficiaryName').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryName);
    this.willGenerateForm2.get('beneficiaryDateOfBirth').setValue(this.userDetails.willFormDetails.benefeciaryDetails.DoBOriginalFormat);
    this.willGenerateForm2.get('beneficiaryRel').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryRelation);
    this.willGenerateForm2.get('beneficiaryIdType').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdType);
    if(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdType  == "Aadhar ID" || this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdType == ""){
      this.benefAadharId = '';
    }else{
      this.benefAadharId = 'Pan';
    }
    this.willGenerateForm2.get('beneficiaryIdNumber').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdCard);

    this.willGenerateForm2.get('beneficiaryName').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryName);
    this.willGenerateForm2.get('beneficiaryDateOfBirth').setValue(this.userDetails.willFormDetails.benefeciaryDetails.DoBOriginalFormat);
    this.willGenerateForm2.get('beneficiaryRel').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryRelation);
    this.willGenerateForm2.get('beneficiaryIdType').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdType);
    if(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdType  == "Aadhar ID" || this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdType == ""){
      this.benefAadharId = '';
    }else{
      this.benefAadharId = 'Pan';
    }
    this.willGenerateForm2.get('beneficiaryIdNumber').setValue(this.userDetails.willFormDetails.benefeciaryDetails.benefeciaryIdCard);
  
    for(let i = 0;i < this.userDetails.willFormDetails.Asset.length-1;i++) {
        this.addAsset();
    }
    for(let i = 0;i < this.userDetails.willFormDetails.Asset.length;i++) {
      for(let j = 0;j<this.userDetails.willFormDetails.Asset[i].Beneficiary.length-1;j++){
        this.addForm3More(i);
    }
      }
    this.willGenerateForm3.patchValue({
      willGenerateFormArray:this.userDetails.willFormDetails.Asset
    });


    this.willGenerateForm4.get('executorName').setValue(this.userDetails.willFormDetails.executorDetails.executorName);
    this.willGenerateForm4.get('executorRel').setValue(this.userDetails.willFormDetails.executorDetails.executorRelation);
    this.willGenerateForm4.get('executorCity').setValue(this.userDetails.willFormDetails.executorDetails.executorCity);
    this.willGenerateForm4.get('altExecutorName').setValue(this.userDetails.willFormDetails.executorDetails.alterExecutorName);
    this.willGenerateForm4.get('altExecutorRel').setValue(this.userDetails.willFormDetails.executorDetails.alterExecutorRelation);
    this.willGenerateForm4.get('altExecutorCity').setValue(this.userDetails.willFormDetails.executorDetails.alterExecutorCity);

    this.willGenerateForm5.get('guardianName').setValue(this.userDetails.willFormDetails.guardianDetails.guardianName);
    this.willGenerateForm5.get('guardianRel').setValue(this.userDetails.willFormDetails.guardianDetails.guardianRelation);
    this.willGenerateForm5.get('guardianCity').setValue(this.userDetails.willFormDetails.guardianDetails.guardianCity);
    this.willGenerateForm5.get('altGuardianName').setValue(this.userDetails.willFormDetails.guardianDetails.alterGuardianName);
    this.willGenerateForm5.get('altGuardianRel').setValue(this.userDetails.willFormDetails.guardianDetails.alterGuardianRelation);
    this.willGenerateForm5.get('altGuardianCity').setValue(this.userDetails.willFormDetails.guardianDetails.alterGuardianCity);
    }
    })
    }

  userName: string;
  userData: any;
  userDetails: any;
  
  formHeader: string = "Will Creation";
  formScreen: number = 1;
  willGenerateButtonFlag: boolean = false;
  nextButtonFlag: boolean = true;
  saveFormData: boolean = true; 

  
  Data: any= {
    FullName: '',
    userEmail: '',
    saveWillDetails: this.saveFormData,
    DateOfBirth: Date(),
    UserDoBOriginalFormat: Date(),
    ParentDetails:{
      Relation:'',
      LiveStatus:'',
      Prefix:'',
      FullName:''
    },
    idType:'',
    idNumber:'',
    FamilyDetails:{
      City:'',
      SpouseName:'',
      HaveKids:'',
      Childrens:[]
    },
    BeneficiaryDetails:{
      Name:'',
      DateOfBirth: '',
      DoBOriginalFormat: '',
      Relation:'',
      IdType:'',
      IdNumber:''
    },
    Executor:{
      Name:'',
      Relation:'',
      City:'',
    },
    AlternateExecutor:{
      Name:'',
      Relation:'',
      City:'',
    },
    Guardian:{
      Name:'',
      Relation:'',
      City:'',
    },
    AlternateGuardian:{
      Name:'',
      Relation:'',
      City:'',
    },
    Asset: [{
      typeOfAsset: '',
      assetDetails: '',
      Beneficiary: [],
      Benelength:''
    }],
    Basicwill: '',
    Annexure:false,
       
  };
  
  ngOnInit() {
    this.willGenerateForm1.get('fullName').setValue(this.userName);
    this.disclaimesPopOver();
        
  }
 


//checking changes on bitbucket

  async disclaimesPopOver () {
    const popover = await this.popOverCtrl.create({
      component: WillDisclaimerComponent,
      componentProps: { },
      cssClass: 'willDisclaimer-popover',
      backdropDismiss: false,
      });
    return popover.present();
  }
  async goldUser(){
     const popover = await this.popOverCtrl.create({
      component: UpgradePopoverComponent,
      cssClass: 'my-custom-class',
    });
     popover.onDidDismiss().then( () => {
      this.willGenerateForm2.get('assets_dist').setValue('true');
    });
     return await popover.present();
    
  }
  popOver () {
     this.authService.currentUser.subscribe((info) => {
      this.planName = info.userCurrentPlanDetails.planName;
    });
    // this.planName = 'platinum';
     if(this.planName !== 'GOLD'){
        this.Data.Basicwill = 'false'; 
        this.distribute = 'true';
        this.formScreen += 1;
        this.updateScreenHeader();
        this.annexure = true;
        this.Data.Annexure = true;
        console.log(this.annexure)
        console.log(this.willGenerateForm3.controls.willGenerateFormArray)
        this.Data.FamilyDetails.SpouseName = this.willGenerateForm2.value.familyDetailSpouseName;
        this.Data.FamilyDetails.HaveKids = this.willGenerateForm2.value.familyDetailHaveKids;
        this.Data.FamilyDetails.Childrens = this.willGenerateForm2.value.Childrens;
      } else {
        this.goldUser();
      }
  
    /* const popover = await this.popOverCtrl.create({
      component: UpgradePopoverComponent,
      cssClass: 'my-custom-class',
    }); */
    // return await popover.present();

   /*  popover.onDidDismiss().then( () => {
      this.willGenerateForm2.get('assets_dist').setValue('true');
    }); */
   
  }
  
  addMore(): void {
    this.Childrens = this.willGenerateForm2.get('Childrens') as FormArray;
    this.Childrens.push(this.addChild());
  }

  deleteChild (i) {
    this.Childrens.removeAt(i);
  }

  goBack () {
    if(this.formScreen === 1) {
      this.navService.navigateBack ();
    } else if(this.formScreen === 4 && this.planName !== 'GOLD' && this.distribute == 'true') {
      this.formScreen -= 1;
      this.updateScreenHeader();
    }
    else if(this.formScreen === 4){
      this.formScreen -= 2;
      this.updateScreenHeader();
      this.annexure = false;
    }
    else{
      this.formScreen-=1;
      this.updateScreenHeader();
      this.annexure = false;
      this.Data.Annexure = false;
    } 
    
    if(this.formScreen<5){
      this.nextButtonFlag=true;
      this.willGenerateButtonFlag=false;
    }
    if(this.formScreen==5){
      this.nextButtonFlag=false;
      this.willGenerateButtonFlag=true;
    }
    
  }

  next(){
    this.formScreen+=1;
    this.updateScreenHeader();
    if(this.formScreen>6){this.formScreen=6;}

  }

  month(givenMonth){
    if(givenMonth == "01"){
      var nameOfMonth = "January";
    }
    else if(givenMonth == "02"){
      nameOfMonth = "Febuary";
    }
    else if(givenMonth == "03"){
      nameOfMonth = "March";
    }
    else if(givenMonth == "04"){
      nameOfMonth = "April";
    }
    else if(givenMonth == "05"){
      nameOfMonth = "May";
    }
    else if(givenMonth == "06"){
      nameOfMonth = "June";
    }
    else if(givenMonth == "07"){
      nameOfMonth = "July";
    }
    else if(givenMonth == "08"){
      nameOfMonth = "August";
    }
    else if(givenMonth == "09"){
      nameOfMonth = "September";
    }
    else if(givenMonth == "10"){
      nameOfMonth = "October";
    }
    else if(givenMonth == "11"){
      nameOfMonth = "November";
    }
    else if(givenMonth == "12"){
      nameOfMonth = "December";
    }
    return nameOfMonth;
  }

//   getAttachments () {
//     this.apiService.get({ name: 'myFiles' }).subscribe(attachments => {
//         this.attachments = attachments;
//     }, error => {
//     });

// }

async aboutEncryption () {
  const popover = await this.popoverController.create({
    component: EncryptionPopoverComponent,
    translucent: true,
    backdropDismiss: false,
    cssClass: 'custom-popoverEncryption'
  });
  return await popover.present();

}
deleteForm3Child (i,j) {
  console.log(i,j);
  this.Beneficiary = this.willGenerateForm3.get('willGenerateFormArray')['controls'][i]
  .get('Beneficiary') as FormArray;
  this.Beneficiary.removeAt(j);
}
addForm3More(j): void {
  console.log(j);
  this.Beneficiary = this.willGenerateForm3.get('willGenerateFormArray')['controls'][j]
  .get('Beneficiary') as FormArray;
  this.Beneficiary.push(this.addForm3Child());
}
addAsset (): void {
  this.willGenerateFormArray = this.willGenerateForm3.get('willGenerateFormArray') as FormArray;
 
  // this.willGenerateFormArray.push(this.control);
  this.willGenerateFormArray.push(this.addForm());
}
getBene(form){
  return form.controls.Beneficiary.controls;
}




  submitForm1(){
    let date: number = +this.willGenerateForm1.value.dateOfBirth.split('/')[0];
    let month: number = +this.willGenerateForm1.value.dateOfBirth.split('/')[1];
    if(date <= 31 && month <=12) {
    if(this.willGenerateForm1.valid){
      this.Data.UserDoBOriginalFormat = this.willGenerateForm1.value.dateOfBirth;
      let dob = (this.willGenerateForm1.value.dateOfBirth).split("/");
     this.nameOftheMonth = this.month(this.months+1);
      this.Data.saveWillDetails = this.saveFormData;
      
      this.Data.userEmail = this.userDetails.email;
      this.Data.FullName= this.willGenerateForm1.value.fullName;
      this.Data.ParentDetails.Relation = this.willGenerateForm1.value.parentDetailRel;
      if(this.Data.ParentDetails.Relation == '' || this.Data.ParentDetails.Relation == 'S/o'){
        this.userGenderForm = 'his';
        this.userGenderTerm = 'himself';
      }else{
        this.userGenderForm = 'her';
        this.userGenderTerm = 'herself';

      }
      this.Data.ParentDetails.LiveStatus = this.willGenerateForm1.value.parentDetailIfLate;
      this.Data.ParentDetails.Prefix = this.willGenerateForm1.value.parentDetailPrefix;
      this.Data.ParentDetails.FullName = this.willGenerateForm1.value.parentDetailName;
      this.Data.FamilyDetails.City = this.willGenerateForm1.value.familyDetailCity;
      
      this.Data.IdType = this.willGenerateForm1.value.idType;
      if(this.Data.IdType == ''){
        this.Data.IdType = 'Aadhar ID';
      }
      // this.Data.IdNumber = this.willGenerateForm1.value.idNumber;
      console.log(this.Data.IdNumber)
      this.mychange(this.willGenerateForm1.value.idNumber);
      // this.Data.DateOfBirth = dob[0] +" " + nameOftheMonth+" "+dob[2];
      this.Data.DateOfBirth = `${this.day} ${this.nameOftheMonth} ${this.year}`
      if(this.Data.ParentDetails.LiveStatus == "empty"){
        this.Data.ParentDetails.LiveStatus = "";
      }
      if(this.saveFormData == true){
        this.submitFormDetails('willForm1');
      }
      

      // common code
      this.formScreen += 1;
      this.updateScreenHeader();
      if(this.formScreen > 6) { this.formScreen = 6;}
      
    }
  }else if( date > 31 && month > 12) {
    alert('Month Range should be 01 - 12 and Date Range should be 01 - 31');
  } else if(date > 31) {
    alert('Date Range should be 01 - 31');
  } else if (month > 12) {
    alert('Month Range should be 01 - 12');
  }

  }
  date(data){
    this.dates = new Date(data);
    console.log(this.dates)
   this.months = this.dates.getMonth();
   this.year = this.dates.getFullYear();
   this.day = this.dates.getDate();
   
  }

  mychange(val) {
    let chIbn = val.split(' ').join('');
    if (chIbn.length > 0) {
      chIbn = chIbn.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    console.log(chIbn);
    this.Data.IdNumber = chIbn;
  }

  submitFormDetails(willformNumber){
    this.header = new HttpHeaders({
      "content-type": "application/json",
      Authorization: this.token,
    });
    this.http.post(`${this.apiService.apiUrl}/user/postWillFormDetails?willForm=${willformNumber}`, this.Data, { headers: this.header })
    .subscribe((res) => {
        console.log(res);
        // this.navService.navigateRoot('/will-download');
      });
  }

  addAsSpouse(){
    console.log(this.equateToSpouse)
    if(this.willGenerateForm2.value.beneficiaryRel == "spouse"){
      this.willGenerateForm2.get('beneficiaryName').setValue(this.equateToSpouse);
      this.submitForm2();
    }
  }
  submitForm2(){
    console.log(this.willGenerateForm2.value.Childrens, 'jhg', this.willGenerateForm2.value.Childrens );
    this.http.get(`${this.apiUrl}/user/paymentConfigDetails`).subscribe((res) => {
      // this.paymentConfig = res;
      console.log(res);
  });
    
   
   
    if(this.willGenerateForm2.valid){

      this.Data.FamilyDetails.SpouseName = this.willGenerateForm2.value.familyDetailSpouseName;
     
      

      // this.willGenerateForm2.value.beneficiaryName = this.willGenerateForm2.value.beneficiaryName;
      this.Data.FamilyDetails.HaveKids = this.willGenerateForm2.value.familyDetailHaveKids;
     
     this.Data.BeneficiaryDetails.Name = this.willGenerateForm2.value.beneficiaryName;
      
      console.log(this.willGenerateForm2.value.beneficiaryDateOfBirth);
      if(this.willGenerateForm2.value.beneficiaryDateOfBirth != undefined){
        this.Data.BeneficiaryDetails.DoBOriginalFormat = this.willGenerateForm2.value.beneficiaryDateOfBirth;
        let dob = (this.willGenerateForm2.value.beneficiaryDateOfBirth).split("/");
      var monthName = this.month(dob[1]);
      this.Data.BeneficiaryDetails.DateOfBirth = dob[0]+", "+monthName+" "+dob[2];
      }
      
      // this.Data.BeneficiaryDetails.DateOfBirth = this.willGenerateForm3.value.beneficiaryDateOfBirth;
        this.Data.BeneficiaryDetails.Relation = this.willGenerateForm2.value.beneficiaryRel;
      
      this.Data.BeneficiaryDetails.IdType = this.willGenerateForm2.value.beneficiaryIdType;
      if(this.Data.BeneficiaryDetails.IdType == ''){
        this.Data.BeneficiaryDetails.IdType = 'Aadhar ID'
      }
      this.Data.BeneficiaryDetails.idNumber = this.willGenerateForm2.value.beneficiaryIdNumber;


      if(this.Data.FamilyDetails.HaveKids == 'true'){
        this.Data.FamilyDetails.Childrens = this.willGenerateForm2.value.Childrens;
        for (let i = 0; i < this.Data.FamilyDetails.Childrens.length ; i++) {
          var date: number = +this.willGenerateForm2.value.Childrens[i].DoB.split('/')[0];
          var month: number = +this.willGenerateForm2.value.Childrens[i].DoB.split('/')[1];
          if(date <= 31 && month <=12) {
          console.log(this.Data.FamilyDetails.Childrens[i]);
          this.Data.FamilyDetails.Childrens[i]["DateOfBirth"] = this.Data.FamilyDetails.Childrens[i]["DoB"];
          let dob = (this.Data.FamilyDetails.Childrens[i]["DateOfBirth"]).split("/");
          let nameOfTheMonth = this.month(dob[1]);
          
          if(nameOfTheMonth != undefined && nameOfTheMonth != ''){
            this.Data.FamilyDetails.Childrens[i]["DateOfBirth"] = ", born on "+dob[0]+" "+nameOfTheMonth+" "+dob[2];
          }
        } else if( date > 31 && month > 12) {
          alert('Month Range should be 01 - 12 and Date Range should be 01 - 31');
          break;
        } else if(date > 31) {
          alert('Date Range should be 01 - 31');
          break;
        } else if (month > 12) {
          alert('Month Range should be 01 - 12');
          break;
        }
      }
      }
     
     
        console.log(this.Data.FamilyDetails);
        if(this.saveFormData == true) {
        this.submitFormDetails("willForm2");
        }
     
      this.formScreen += 2;
      this.distribute = 'false';
      this.updateScreenHeader();
      if(this.formScreen > 6) {
        this.formScreen = 6;
      }
    }
  
  }

// }else if( date > 31 && month > 12) {
//   alert('Month Range should be 01 - 12 and Date Range should be 01 - 31');
// } else if(date > 31) {
//   alert('Date Range should be 01 - 31');
// } else if (month > 12) {
//   alert('Month Range should be 01 - 12');
// } 
  // submitForm3(){
  //   var date: number = +this.willGenerateForm3.value.beneficiaryDateOfBirth.split('/')[0];
  //   var month: number = +this.willGenerateForm3.value.beneficiaryDateOfBirth.split('/')[1];
  //   if(date <= 31 && month <=12 && this.willGenerateForm3.value.beneficiaryDateOfBirth !== (null || '')) {
  //   if(this.willGenerateForm3.valid){
  //     this.Data.BeneficiaryDetails.Name = this.willGenerateForm3.value.beneficiaryName;
      
  //     console.log(this.willGenerateForm3.value.beneficiaryDateOfBirth);
  //     if(this.willGenerateForm3.value.beneficiaryDateOfBirth != undefined){
  //       this.Data.BeneficiaryDetails.DoBOriginalFormat = this.willGenerateForm3.value.beneficiaryDateOfBirth;
  //       let dob = (this.willGenerateForm3.value.beneficiaryDateOfBirth).split("/");
  //     var monthName = this.month(dob[1]);
  //     this.Data.BeneficiaryDetails.DateOfBirth = dob[0]+", "+monthName+" "+dob[2];
  //     }
      
  //     // this.Data.BeneficiaryDetails.DateOfBirth = this.willGenerateForm3.value.beneficiaryDateOfBirth;
  //       this.Data.BeneficiaryDetails.Relation = this.willGenerateForm3.value.beneficiaryRel;
      
  //     this.Data.BeneficiaryDetails.IdType = this.willGenerateForm3.value.beneficiaryIdType;
  //     if(this.Data.BeneficiaryDetails.IdType == ''){
  //       this.Data.BeneficiaryDetails.IdType = 'Aadhar ID'
  //     }
  //     this.Data.BeneficiaryDetails.idNumber = this.willGenerateForm3.value.beneficiaryIdNumber;
  //     if(this.saveFormData == true){    
  //     this.submitFormDetails("willForm3");
  //     }
  //     //common code
  //     this.formScreen+=1;
  //     this.updateScreenHeader();
  //     if(this.formScreen>6){this.formScreen=6;}
  //   }
  // } else if( date > 31 && month > 12) {
  //   alert('Month Range should be 01 - 12 and Date Range should be 01 - 31');
  // } else if(date > 31) {
  //   alert('Date Range should be 01 - 31');
  // } else if (month > 12) {
  //   alert('Month Range should be 01 - 12');
  // } else {
  //   if(this.willGenerateForm3.valid){
  //     this.Data.BeneficiaryDetails.Name = this.willGenerateForm3.value.beneficiaryName;

  //     console.log(this.willGenerateForm3.value.beneficiaryDateOfBirth);
  //     if(this.willGenerateForm3.value.beneficiaryDateOfBirth != undefined){
  //       this.Data.BeneficiaryDetails.DoBOriginalFormat = this.willGenerateForm3.value.beneficiaryDateOfBirth;
  //       let dob = (this.willGenerateForm3.value.beneficiaryDateOfBirth).split("-");
  //     var monthName = this.month(dob[1]);
  //     this.Data.BeneficiaryDetails.DateOfBirth = monthName+" "+dob[2]+", "+dob[0];
  //     }

  //     // this.Data.BeneficiaryDetails.DateOfBirth = this.willGenerateForm3.value.beneficiaryDateOfBirth;
  //       this.Data.BeneficiaryDetails.Relation = this.willGenerateForm3.value.beneficiaryRel;

  //     this.Data.BeneficiaryDetails.IdType = this.willGenerateForm3.value.beneficiaryIdType;
  //     if(this.Data.BeneficiaryDetails.IdType == ''){
  //       this.Data.BeneficiaryDetails.IdType = 'Aadhar ID'
  //     }
  //     this.Data.BeneficiaryDetails.idNumber = this.willGenerateForm3.value.beneficiaryIdNumber;
  //     if(this.saveFormData == true){
  //     this.submitFormDetails("willForm3");
  //     }
  //     //common code
  //     this.formScreen+=1;
  //     this.updateScreenHeader();
  //     if(this.formScreen>6){this.formScreen=6;}
  //   }
  // }
 
  // }

  selectChange(){
    console.log("after : ",this.saveFormData)
    this.saveFormData = !this.saveFormData;
    console.log("before : ",this.saveFormData)
  }
    
    
  submitForm3 () {
    // for(let i = 0; i < this.willGenerateForm3.controls.willGenerateFormArray['controls'].length; i++) {
    //   for(let k = 0; k < this.willGenerateForm3.controls.willGenerateFormArray['controls'][i]['controls'].Beneficiary.controls.length; k++){
        if (!this.willGenerateForm3.controls.willGenerateFormArray.valid) {
          this.isSubmitted = true;
        }
         else
          { 
            this.isSubmitted = false;
            console.log(this.willGenerateForm3.value.willGenerateFormArray['0']['rupees_percent']);
            this.annexure = true;
            this.Data.Asset  = this.willGenerateForm3.value.willGenerateFormArray;
            for(let j = 0; j < this.willGenerateForm3.value.willGenerateFormArray.length; j++){
              console.log(this.Data.Asset[j].Beneficiary.length);
              this.Data.Asset[j].Benelength = (this.Data.Asset[j].Beneficiary.length + 1).toString();
              console.log( this.Data.Asset[j].Benelength);
            }
            if (this.isSubmitted == false) {
              this.formScreen += 1;
              console.log(this.formScreen);
              this.updateScreenHeader();
            }
            if(this.formScreen > 6) {
              this.formScreen = 6;
            }
            this.submitFormDetails('willForm3');
          }
   
}
  submitForm4(){
    if(this.willGenerateForm4.valid){
      this.Data.Executor.Name = this.willGenerateForm4.value.executorName;
      this.Data.Executor.Relation = this.willGenerateForm4.value.executorRel;
      if(this.willGenerateForm4.value.executorRel == 'other'){
        this.Data.Executor.Relation = this.willGenerateForm4.value.executorRelOther;
      }
      
      this.Data.Executor.City = this.willGenerateForm4.value.executorCity;

      this.Data.AlternateExecutor.Name = this.willGenerateForm4.value.altExecutorName;
      this.Data.AlternateExecutor.Relation = this.willGenerateForm4.value.altExecutorRel;
      if(this.willGenerateForm4.value.altExecutorRel == 'other'){
        this.Data.AlternateExecutor.Relation = this.willGenerateForm4.value.altExecutorRelOther;
      }
      this.Data.AlternateExecutor.City = this.willGenerateForm4.value.altExecutorCity;
      if(this.saveFormData == true){
      this.submitFormDetails("willForm4");
      }
      //common code
      this.formScreen+=1;
      this.updateScreenHeader();
      if(this.formScreen>6){this.formScreen=6;}
    }
  }

  
  async fileSizeLimitAlert(noOfFilesAsPerPlan) {
    if(noOfFilesAsPerPlan == 1){
      var addNoOfFilesWithAddlSentence = noOfFilesAsPerPlan+" file";
     }else{
         addNoOfFilesWithAddlSentence = noOfFilesAsPerPlan+" files";
     }
     const alertFailure = this.alertCtrl.create({
       header: `Upload Failed!`,
       subHeader: `Your current plan limits you to upload `+addNoOfFilesWithAddlSentence+`. Please upgrade your plan to upload this file and enjoy more benefits.`,
       buttons: ['Ok']
     });
     return (await alertFailure).present();
  }


  submitForm5(){

    if(this.willGenerateForm5.valid){

      this.Data.Guardian.Name = this.willGenerateForm5.value.guardianName;
      this.Data.Guardian.Relation = this.willGenerateForm5.value.guardianRel;
      if(this.willGenerateForm5.value.guardianRel == 'other'){
        this.Data.Guardian.Relation = this.willGenerateForm5.value.guardianRelOther;
      }
      
      this.Data.Guardian.City = this.willGenerateForm5.value.guardianCity;

      this.Data.AlternateGuardian.Name = this.willGenerateForm5.value.altGuardianName;
      this.Data.AlternateGuardian.Relation = this.willGenerateForm5.value.altGuardianRel;
      if(this.willGenerateForm5.value.altGuardianRel == 'other'){
        this.Data.AlternateGuardian.Relation = this.willGenerateForm5.value.altGuardianRelOther;
      }
      this.Data.AlternateGuardian.City = this.willGenerateForm5.value.altGuardianCity;      
      if(this.saveFormData == true){
      this.submitFormDetails("willForm5"); 
      }
      //common code
      this.formScreen+=1;
      this.updateScreenHeader();
      if(this.formScreen>6){this.formScreen=6;}
    }
  }


  updateScreenHeader(){
    if(this.formScreen==1){
      this.formHeader='Will Creation';
    }
    if(this.formScreen==2){
      this.formHeader='Family Details';
    }
    if(this.formScreen ==3 && this.planName !='GOLD'){
      this.formHeader='Disposition of Assets';
    }
    if(this.formScreen==4){
      this.formHeader="Executor Details";
    }
    if(this.formScreen==5){
      this.formHeader='Guardian Details (Optional)';
    }
    if(this.formScreen==6){
      this.formHeader='Will Preview';
    } 
  }

  setIdType(idType){
    console.log(idType);
    this.willGenerateForm2.get('idType').setValue(idType);
  }

  setBeneficiaryIdType(idType){
    this.willGenerateForm2.get('beneficiaryIdType').setValue(idType);
  }

  saveFormDataFunc(value){
    console.log(value);
    if(value=='yes'){
      this.saveFormData= true;
    }else{
      this.saveFormData= false;
    }
  }

  public async downloadwilltest(){
    let filename = "Will-"+this.userDetails.email+".pdf"
    this.downloadDocumentService.checkAndroidPermissions ()
    .then (async (status) => {
      // this.downloadDocumentService.presentSpinner('Download in Progress...');
      await this.downloadDocumentService.downloadwillFile(this.userDetails.email)
      .then(async (data) => {
        let fileUrl: string;
        fileUrl = data;
       
          
          this.downloadFile(filename,fileUrl);
        
        
      })

      
    },
    err =>{
      this.accessDeniedAleart();
    })
  }

  accessDeniedAleart () {
    let newVar: any;
    newVar = window.navigator;
    newVar.notification.alert(
        'Download Failed',   // the message
        function () { },                      // a callback
        'Access Denied',                            // a title
        'OK'                                // the button text
    );
  }

  public async downloadFile(filename,fileUrl) {
    this.loadingCtrl.dismiss();
          // this.downloadDocumentService.downloadSuccessAlert(filename);
                const popover = await this.popOverCtrl.create({
        component: WillDownloadAlertComponent,
        cssClass: 'willDownloadAlert-popover',
        });
        this.downloadDocumentService.pushNotificationToStatusBar(fileUrl, filename);
      return await popover.present();
          
  }

  saveDetails(){
    this.navService.navigateRoot('/home');
    this.popOverCtrl.dismiss();
  }

  downloadWill(){
    //write code for download
    //onClick download button should download a WILL doc
    // if(this.attachments.length >= this.userDetails.userCurrentPlanDetails.noOfFilesLimit){
    //   this.fileSizeLimitAlert(this.userDetails.userCurrentPlanDetails.noOfFilesLimit);
    // }else{
    
    this.header = new HttpHeaders({
      "content-type": "application/json",
      Authorization: this.token,
    });

    this.http.post(`${this.apiService.apiUrl}/getPersonalisedWill`, this.Data, { headers: this.header })
    .subscribe((res) => {
      this.downloadwilltest();
        // this.navService.navigateRoot('/will-download');
    //     this.http.post(`${this.apiService.apiUrl}/getPersonalisedWill`, this.Data, { headers: this.header })
    // .subscribe((res) => {
    //   // this.downloadwilltest();
    //     this.navService.navigateRoot('/will-download');
    //   });
      });
      
    //After success response redirect to
    // this.navService.navigateRoot('/will-download');

  // }
  }

}

