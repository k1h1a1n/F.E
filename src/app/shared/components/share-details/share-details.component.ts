import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ContactServiceService } from '../../services/contact-service.service';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { SocialSharingComponent } from '../social-sharing/social-sharing.component';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from '@durity/services';
import { AttachmentsService } from '../../services/attachments.service';
import { UploadDocumentsService } from '../../services/upload-documents.service';

@Component({
  selector: 'app-share-details',
  templateUrl: './share-details.component.html',
  styleUrls: ['./share-details.component.scss'],
})
export class ShareDetailsComponent implements OnInit {
  totalContacts: number;
  contacts = [];
  recepient: any;
  emails: Array<{primaryEmail: any}> = [];
  email: any;
  upload: string;
  userId: string;
  durityId: string;
  invalidPassword: any = '';
  password: string = '';
  userName: string;
  constructor (
    private socialSharing: SocialSharing,
    private contactService: ContactServiceService,
    private navService: NavigationService,
    private wizardService: SignupWizardService,
    public globalVariablesProvider: GlobalVariablesService,
    public popOverCtrl: PopoverController,
    private apiService: ApiService,
    public actionSheetCtrl: ActionSheetController,
    private attachmentService: AttachmentsService,
    private authService: AuthService,
    private uploadDocumentsService: UploadDocumentsService
  ) {

    this.userId = this.globalVariablesProvider.userId;
    this.attachmentService.getAttachments();

  }

  ionViewWillEnter () {
    this.contactService.getContacts ();
    this.uploadDocumentsService.share.subscribe((data) => {
      this.recepient = data;
      this.upload = localStorage.getItem('Upload');
      });

    this.recepient.forEach(element => {
        this.contactService.getContactEmailById(element.contact_id).then(res => {
          this.email = res;
          this.emails.push({primaryEmail: res});

      });
    });
  }

  ngOnInit () {
    this.authService.currentUser.subscribe(user => this.durityId = user.durity_id);
    this.authService.currentUser.subscribe(user => this.userName = user.profile.name);
  }

  async presentPopover () {
    const popOver = await this.popOverCtrl.create({
      component: SocialSharingComponent,
      componentProps: {password: this.password, durityId: this.durityId, username: this.userName},
      cssClass: 'custom-sharePopOver'
    });
    await popOver.present();
    popOver.onDidDismiss().then(data => {

    });

  }
share () {
  console.log(" **** ",this.password);
  if(this.password == ('')){
    // console.log(" &&&&& ",this.password, this.invalidPassword);

    this.invalidPassword = "*Please enter password";
    // this.presentPopover();

  }else{
    // console.log(" %%%% ",this.password, this.invalidPassword);

    this.invalidPassword = '';
    this.presentPopover();
  }
  }

  finish () {
    this.navService.navigateRoot('/document-list');
  }
}
