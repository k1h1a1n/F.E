import { Component, OnInit } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { ToastComponent } from '../toast/toast.component';
import { FeedbackSubmitComponent } from '../feedback-submit/feedback-submit.component';
import { ProfileSubmitComponent } from '../profile-submit/profile-submit.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit {
  apiUrl: string = environment.apiUrl;
  user: any;
  userId: string;
  token: string;
  profileForm: FormGroup;
  header: HttpHeaders;
  ngOnInit () {

  }

  constructor (
               private authService: AuthService,
               private apiService: ApiService,
               private fb: FormBuilder,
               public popoverController: PopoverController,
               private modalCtrl: ModalController,
               private http: HttpClient
               ) {
                this.getUser ();

                this.profileForm = this.fb.group({
                name : new FormControl(this.user.profile.name),
                // email: ['', Validators.required],
                alternateEmailAddress: new FormControl(this.user.profile.alternateEmailAddress, Validators.pattern(String.raw`^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$`)),
                telephoneNumber: new FormControl(this.user.profile.telephoneNumber),
                alternateTelephoneNumber: new FormControl(this.user.profile.alternateTelephoneNumber)

      });
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

  async updateProfile () {

      }

  submitForm () {
      this.apiService.put('user/profile', {profile: this.profileForm.value}).subscribe(async (data) => {
        // this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {headers: this.header}).subscribe((res) => {
          // this.authService.setAuth(res);
          this.authService.currentUser.subscribe((user) => {
            user.profile.name = data.name,
            user.profile.alternateEmailAddress = data.alternateEmailAddress,
            user.profile.alternateTelephoneNumber = data.alternateTelephoneNumber,
            user.profile.telephoneNumber = data.telephoneNumber
            // user.profile.advisorCode = res.profile.advisorCode,
            // user.profile.advisorName = res.profile.advisorName
          });
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

    cancel () {
      this.modalCtrl.dismiss();
    }

}
