import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { ToastComponent } from '../toast/toast.component';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  changePassForm: FormGroup;
  user: any;
  constructor (
               private navService: NavigationService,
               private formBuilder: FormBuilder,
               private modalCtrl: ModalController,
               private authService: AuthService,
               private apiService: ApiService) { }
  ngOnInit () {
    this.changePassForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required,Validators.minLength(6)] ],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',[Validators.required, Validators.minLength(6)]]
    });
  }
  async continue () {
   if (this.changePassForm.valid){
     this.getCurrentUser();  
     const credentials = {
     email: this.user.email,
     password: this.changePassForm.value.oldPassword
     };
     this.authService.attemptAuth('login', credentials).then(res=>{
     // this.authService.resetPassword(this.changePassForm.value.newPassword, this.user._id, this.user.token);
        this.apiService.put(`user/password`, {password: this.changePassForm.value.newPassword, confirmPassword:this.changePassForm.value.confirmPassword}).subscribe(res=>{
        this.passwordChangePopover();
      },error=>{
        this.authService.presentToast('Something went wrong. Please try again.');
        console.log(error);
      });
     }).catch(err=>{
        this.authService.presentToast('Wrong password');
    })
  }
}
 getCurrentUser(){
  this.authService.currentUser.subscribe((user) => {
    this.user = user; 
  });
 }
 async passwordChangePopover(){
  this.navService.navigateRoot('/login');
  const modal = await this.modalCtrl.create({
    component: ToastComponent,
    cssClass: 'simple-delete-modal',
    backdropDismiss:true,
    componentProps: { changePassword: 'changePassword' }
    });
       await modal.present();
 }
 goBack () {
    this.navService.navigateBack();
  }
}
