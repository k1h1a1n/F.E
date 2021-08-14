import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { NavigationService } from '@durity/services';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-will-com',
  templateUrl: './will-com.component.html',
  styleUrls: ['./will-com.component.scss'],
})
export class WillComComponent implements OnInit {
  apiUrl: string = environment.apiUrl;

  activeSection: any = 'contacts';
  public upload = false;
  userId: string;
  token: string;
  header: HttpHeaders;
  willQes = ['Top 5 misconceptions of creating a Will.', "I'm only in my 40's, do I need to create a Will?", "What happens if I don't have a Will?"];

  constructor(
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
  }

  ngOnInit() {}

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

  goBack () {
    this.navService.navigateBack ();
  }

}
