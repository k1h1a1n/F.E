import { Component, OnInit } from '@angular/core';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { NavigationService } from '../../services/navigation.service';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-upload-profile-pic',
  templateUrl: './upload-profile-pic.component.html',
  styleUrls: ['./upload-profile-pic.component.scss'],
})
export class UploadProfilePicComponent implements OnInit {
  apiUrl: string = environment.apiUrl;
  header: HttpHeaders;
  user: any;
  userId: string;
  token: string;
  fileUrl: string;

  constructor (
    private navService: NavigationService,
    private apiService: ApiService,
    private authService: AuthService,
    private http: HttpClient,
    private signUpWizardService: SignupWizardService
  ) {

   }

  ngOnInit () {
    this.fileUrl = this.signUpWizardService.fileUrl;
  }

  getUser () {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      this.userId = user._id;
      this.token = user.token;
    });
    this.header = new HttpHeaders({
      'content-type': 'application/json',
      Authorization: this.token,
  });
  }

  cancel () {
    this.navService.navigateBack();

  }

  save () {
    this.http.post(`${this.apiUrl}/user/uploadProfilePic?user_id=${this.userId}`, this.fileUrl, {headers: this.header}).subscribe((data) => {
    });
    this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
      this.authService.setAuth(res);
});
    this.navService.navigateForword('/profile-screen');
  }

}
