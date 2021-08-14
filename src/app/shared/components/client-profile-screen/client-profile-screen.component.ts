import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-client-profile-screen',
  templateUrl: './client-profile-screen.component.html',
  styleUrls: ['./client-profile-screen.component.scss'],
})
export class ClientProfileScreenComponent implements OnInit {
  apiUrl: string = environment.apiUrl;

  userForm: FormGroup;
  userDetails:any;
  header: HttpHeaders;
  token:string;
  removeCLient:string = '';
  userRemoveClientForm: FormGroup;


  constructor(
    private navService: NavigationService,
    public formBuilder: FormBuilder,
    public auth: AuthService,
    public apiService: ApiService,
    private http: HttpClient,
    public events: Events

  ) { 
    this.auth.currentUser.subscribe((user) => {
      this.token = user.token;
      this.userDetails = user;
     
      this.header = new HttpHeaders({
        "content-type": "application/json",
        Authorization: this.token,
      });
    });

    this.userForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose( [Validators.required])),
      alternateEmailAddress: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      telephoneNumber: new FormControl('', Validators.compose( [ Validators.required, Validators.maxLength(15),Validators.minLength(10),
        ]))
  });
  console.log(this.userDetails.profile.telephoneNumber);
  this.userForm.get('name').setValue(this.userDetails.profile.name);
  this.userForm.get('alternateEmailAddress').setValue(this.userDetails.email);
  this.userForm.get('telephoneNumber').setValue(this.userDetails.profile.telephoneNumber);

    this.userRemoveClientForm = this.formBuilder.group({
      advisorCode:  [''],
  });;



  }

  ngOnInit() {}

  goBack(){
    this.navService.navigateBack ();
  }

  removeClient(){
    console.log("^^^^^^^^")

    let updateAdvisor = {advisorCode:'',advisorName:''}
    this.apiService.put('user/profile', {profile: updateAdvisor}).subscribe(async (data) => {
     this.getAdvisorClientzlist();
      // console.log(data);
      // this.navService.navigateForword('/home');

      // this.auth.currentUser.subscribe((user) => {
  
      // })
    });

  }

  getAdvisorClientzlist(){
console.log("***********");
  this.http
    .get(`${this.apiUrl}/user/getListOfClientsOnAdvCode?advisorCode=${this.userDetails.profile.advisorCode}`, {
      headers: this.header,
    })
    .subscribe((res) => {
      let result = res[0];
      console.log("&&&&&&");
      // this.auth.setAuth(res);
      // this.listOfClientsForAdvisor = res;
      this.auth.currentUser.subscribe((user) => {

      user._id = result._id,
      user.configuration.signupProcessCompleted = result.configuration.userEncryption.passwordHash,
      user.configuration.userEncryption.passwordHash = result.configuration.userEncryption.passwordHash,
      user.configuration.userEncryption.isEnabled = result.configuration.signupProcessCompleted,

      user.profile.name = result.profile.name,
      user.email = result.email
      this.events.publish('username',res);
      this.navService.navigateForword('/home');

      // this.userName = user.profile.name,
      })

    });
  }

  onSubmit(){
    if(this.userForm.valid){
    // console.log(this.userForm.value);
    
    this.apiService.put('user/profile', {profile: this.userForm.value}).subscribe(async (data) => {
      console.log(data);
      this.auth.currentUser.subscribe((user) => {
        // this.token = user.token;
        // this.userDetails = user;
        user.profile.name = data.name,
        user.profile.telephoneNumber = data.telephoneNumber,
        this.navService.navigateForword('/home');

        
      })
      // this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
      //   this.authService.setAuth(res);
    });
  }
  }

}
