import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { DeletePopoverComponent } from '../delete-popover/delete-popover.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  user: any;
  public settingsPages = [
    {
        title: 'About Encryption',
        type: 'navigate',
         url: '/encrypt-details',
         src: 'assets/imgs/enhanced_encryption-24px.svg'
    },
    {
        title: 'Change Log-In Password',
        type: 'navigate',
        url: '/change-password',
        icon: 'key'
    },
    {
        title: 'Contact Us',
        type: 'navigate',
        url: '/contact-us',
        src: "assets/imgs/contact_support-24px.svg"
    },
    {  
        title: 'Version V1.18',
        type: 'navigate',
        src: "assets/imgs/update-24px.svg"
    }, 
    // {
    //     title: 'Close account',
    //     type: 'popover',
    //     // url: '/faqs',
    //     src: 'assets/imgs/how_to_reg2-24px.svg'
    // },
];
  constructor(private navService: NavigationService, private modalCtrl: ModalController, private auth: AuthService) { }
  ngOnInit() {}
  goto (pageName: any) {
    this.navService.navigateForword(pageName.url);
  }
  goBack () {
  this.navService.navigateBack ();
  }
  closeAccount(){
    this.navService.navigateRoot('/home');
    this.getUser();
    this.deleteUserAccount(this.user);
  }
  getUser () {
    this.auth.currentUser.subscribe((user) => {
      this.user = user;
      });
}
  async deleteUserAccount(User) {
    const modal = await this.modalCtrl.create({
        component: DeletePopoverComponent,
        cssClass: 'simple-delete-user-modal',
        componentProps: { deleteType: 'deleteUserAccount', user: User, contactId: '', fileName: '' }
    });
    await modal.present();
}

}
