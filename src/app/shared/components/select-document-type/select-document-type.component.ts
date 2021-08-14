import { ActivatedRoute} from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { NavigationService } from '@durity/services';
import {  PopoverController, NavController,  } from '@ionic/angular';
import { TextNoteComponent } from '../text-note/text-note.component';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-select-document-type',
  templateUrl: './select-document-type.component.html',
  styleUrls: ['./select-document-type.component.scss'],
})
export class SelectDocumentTypeComponent implements OnInit {
  signInType:any;
  category: any;
  user;
  constructor (
    private wizardService: SignupWizardService,
    private androidPermissions: AndroidPermissions,
    private navService: NavigationService,
    public popOverCtrl: PopoverController,
    private navCtrl: NavController,
    public globalvariablesProvider: GlobalVariablesService,
    private authService: AuthService,
    public route: ActivatedRoute

  ) { 
    this.route.paramMap.subscribe((paramMap) => {
      console.log('hiiiiiiii');
      if ( paramMap.has('id')) {
        console.log(paramMap.get('id'));
          this.category = paramMap.get('id');
          console.log(this.category);
      }else{
        this.category="";
      }
    });
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit () {
    this.globalvariablesProvider.addBeneficiaries = false;
  }

  ionViewWillEnter () {
    this.signInType = this.globalvariablesProvider.signInType;

}

  goto (pageName: any, data?: any) {
    this.navService.goto(pageName, data);
  }

  goBack () {
  this.navService.navigateBack ();
  }

  skip(){
    // this.navService.navigateForword('/everything-set');
    this.navService.navigateRoot('/everything-set');


  }

  async selectDocType (type) {
    if (type === 'file') {

      this.wizardService.getFile('log-in',this.category);

    } else if (type === 'note') {
      this.globalvariablesProvider.uploadType = 'text-note';
      this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status => {
          if (status.hasPermission) {
            this.navService.navigateForword(['/text-note']);
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(response => {
              if (response.hasPermission) {
                this.navService.navigateForword(['/text-note']);
            }
          });
        }
      });
    } else if (type === 'photo-camera' || type==='photo-camscan') {
      this.wizardService.caddPhoto('log-in',type);

    } else if (type === 'audio') {
      this.wizardService.captureAudio('log-in');

    } else if (type === 'video') {

      this.wizardService.addVideo('log-in');
    }
  }

  async presentModal () {
    const modal = await this.popOverCtrl.create({
      component: TextNoteComponent,
      componentProps: {},
      cssClass: 'custom-PopOver'
    });
    await modal.present();
    modal.onDidDismiss().then(data => {
    });

  }
}
