import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { PopoverController, NavParams } from '@ionic/angular';
import { NavigationService } from '../../services/navigation.service';
@Component({
  selector: 'app-social-sharing',
  templateUrl: './social-sharing.component.html',
  styleUrls: ['./social-sharing.component.scss'],
})
export class SocialSharingComponent  {

  private password = 'enter password';
  durityId: any;
  userName: any;
  constructor (private socialSharing: SocialSharing, public navParams: NavParams, private popOverCtrl: PopoverController, private navService: NavigationService) {
    this.password = navParams.get('password');
    this.userName = navParams.get('username');
    this.durityId = navParams.get('durityId');
   }

  dropdown () {
   this.popOverCtrl.dismiss();
  }


  whatsappShare () {
    this.socialSharing.shareViaWhatsApp(this.getwhatsMessage () , null, null);
    this.navService.navigateForword('/document-list');
    this.popOverCtrl.dismiss();
  }

  emailShare () {
    this.socialSharing.shareViaEmail(this.getMessage(), null, null);
    this.navService.navigateForword('/document-list');
    this.popOverCtrl.dismiss();
  }
  clipboardshare () {
  }

  private getMessage () {
    this.password = this.password;
    return `Dear one,\n \n This is to inform you that I'm storing my confidential information for you in Durity. The information is safely encrypted(locked) using my 'Master password', which will be needed at the time of decryption. My master password is
    \n ${this.password}
    \n In case of emergency, please contact Durity.life to decrypt(Unlock) & access the information/documents.
    \n I also recommend you to create an account in Durity and safeguard the future of your family and loved ones.
    \n Please make sure you store my 'Master password' carefully. Since Durity does not store any passwords, they won't be able to help you recover the password in case you lose it.
    \n \n Regards\n ${this.userName}\n Durity ID is:${this.durityId}` ;
  }
  private getwhatsMessage () {
    this.password = this.password;
    return `Dear one,\n \n This is to inform you that I'm storing my confidential information for you in Durity. The information is safely encrypted(locked) using my 'Master password', which will be needed at the time of decryption. My master password is
    \n ${this.password}
    \n In case of emergency, please contact Durity.life to decrypt(Unlock) & access the information/documents.
    \n I also recommend you to create an account in Durity and safeguard the future of your family and loved ones.
    \n Please make sure you store my 'Master password' carefully. Since Durity does not store any passwords, they won't be able to help you recover the password in case you lose it.
    \n \n Regards\n ${this.userName}\n Durity ID is:${this.durityId}` ;
  }
}
