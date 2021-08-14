import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, NavController } from '@ionic/angular';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  attachmentMessage: string;
  contactMessage: string;
  revokeAccessMessage: string;
  feedbackMessage: string;
  updateProfile: string;
  contactUs: string;
  changePassword:string;

  constructor ( public navParams: NavParams, public modalCtrl: ModalController, private navService: NavigationService) {
   this.attachmentMessage = navParams.get('deleteMessage');
   this.contactMessage = navParams.get('deleteContactMessage');
   this.revokeAccessMessage = navParams.get('revokeAccessMessage');
   this.feedbackMessage = navParams.get('feedbackMessage');
   this.updateProfile = navParams.get('updateProfile')
   this.contactUs=navParams.get('contactUsMessage');
   this.changePassword=navParams.get('changePassword');
  }

  ngOnInit () {
    if(!this.changePassword){
    setTimeout(() => {
      this.modalCtrl.dismiss();
      if (this.feedbackMessage ) {
        this.navService.navigateRoot('/home');
      }
     else if(this.contactUs){
        this.navService.navigateBack();
      }
    }, 800);
  }
  }
  login() {
     this.modalCtrl.dismiss();
     this.navService.navigateRoot('/login');
  }
  goBack(){
    this.navService.navigateBack();
  }
  }


