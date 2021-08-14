import { Component} from '@angular/core';
import { NavigationService } from '@durity/services';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { ContactServiceService } from 'src/app/shared/services/contact-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { Storage } from '@ionic/storage';
import { ApiService } from 'src/app/services/api.service';
import { AttachmentsService } from 'src/app/shared/services/attachments.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent  {
apiUrl: string = environment.apiUrl;
public upload = true;
activeSection: any  = 'encryption';
  userId: string;
  token: string;
  header: HttpHeaders;
  constructor (
    private navService: NavigationService,
    public globalVariablesProvider: GlobalVariablesService,
    private contactService: ContactServiceService,
    private attachmentService: AttachmentsService,
    private storage: Storage,
    private auth: AuthService,
    private apiService: ApiService,
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
    let userEmail;
    this.auth.currentUser.subscribe(user => userEmail = user.email);
    storage.set(userEmail, 'security');
    this.contactService.getContacts ();
    this.attachmentService.getAttachments ();
   }
   goBack () {
    this.navService.navigateBack ();
  }
 continue(){
    this.navService.navigateForword('/select-doc');
 }
 normalUpload () {
  // this.auth.configuration.subscribe((status) => {
  //   status.addedExtraSecurity = false;
  // });
  this.upload = true;
  // this.navService.navigateForword('/select-doc');
  localStorage.setItem('Upload', JSON.stringify(this.upload));
  this.apiService.post('user/userEncryptionStatus', {userEncryption: {isEnabled: false, algorithm: 'none'}}).subscribe((data) => {
   });
  this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
    this.auth.setAuth(res);
});
  }
  withEncrypt () {
    // this.auth.configuration.subscribe((status) => {
    //   status.addedExtraSecurity = true;
    // });
    this.upload = false;
    this.globalVariablesProvider.encryptFile = true;
    // this.navService.navigateForword('/select-doc');
    localStorage.setItem('Upload', JSON.stringify(this.upload));
    this.apiService.post('user/userEncryptionStatus', {userEncryption: {isEnabled: true, algorithm: 'AES-256'}}).subscribe((data) => {
      this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
        this.auth.setAuth(res);
    });
    });
  }

}
