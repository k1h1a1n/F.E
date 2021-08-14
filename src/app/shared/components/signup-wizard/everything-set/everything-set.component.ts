import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-everything-set',
  templateUrl: './everything-set.component.html',
  styleUrls: ['./everything-set.component.scss'],
})
export class EverythingSetComponent {
  apiUrl: string = environment.apiUrl;
  userId: string;
  token: string;
  header: HttpHeaders;

  constructor (
    private http: HttpClient,
    private navService: NavigationService,
    private globalVariablesProvider: GlobalVariablesService ,
    private storage: Storage,
    private auth: AuthService,
    private apiService: ApiService
  ) {

    this.globalVariablesProvider.signInType = 'login';

    this.auth.currentUser.subscribe((user) => {
      this.userId = user._id;
      this.token = user.token;
      this.header = new HttpHeaders({
       'content-type': 'application/json',
       Authorization: this.token,
   });
   });
  }


  finish () {
    this.apiService.post('user/signupProcessStatus', {signupProcessCompleted: true}).subscribe((data) => {
      this.navService.navigateForword('/home');
    });

  //   this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
  //     this.auth.setAuth(res);
  // });
  }

}
