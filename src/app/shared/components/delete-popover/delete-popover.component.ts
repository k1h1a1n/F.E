import { Component, OnInit } from '@angular/core';
import { ContactServiceService } from '../../services/contact-service.service';
import { NavParams, ModalController, ToastController, PopoverController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from '@durity/services';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { AttachmentsService } from '../../services/attachments.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-delete-popover',
  templateUrl: './delete-popover.component.html',
  styleUrls: ['./delete-popover.component.scss'],
})
export class DeletePopoverComponent implements OnInit  {
  public deleteType;
  contactId: string;
  fileName: string;
  attachmentId: string;
  tier: string;
  index: string;
  showtoaster   = true;
  userDetails: string;
  constructor (
    private authService: AuthService,
    private contactService: ContactServiceService,
    private attachmentService: AttachmentsService,
    private loadingCtrl: LoadingController,
    private navParams: NavParams,
    private navService: NavigationService,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController

  ) {
   }

   ngOnInit() {
    this.deleteType = this.navParams.get('deleteType');
    this.contactId = this.navParams.get('contactId');
    this.fileName = this.navParams.get('fileName');
    this.attachmentId = this.navParams.get('fileId');
    this.tier = this.navParams.get('tier');
    this.index = this.navParams.get('index');
    this.userDetails = this.navParams.get('user');
  }

  deleteContact () {
    this.contactService.deleteContact(this.contactId).subscribe((data) => {
      this.contactService.getContacts();
      this.modalCtrl.dismiss({
        contactId: this.contactId
      });
      this.deleteContactMessage();

    });

  }

  deleteAttachment () { 
    this.attachmentService.delete(this.attachmentId).subscribe((data) => {
      this.modalCtrl.dismiss({
        contactId: this.contactId
      });
      this.deleteAttachmentMessage ();
    }, error => {
      this.modalCtrl.dismiss();

      // this.modalCtrl.dismiss({
      //   contactId: this.contactId
      // });
  });
  }
  deleteCategory(){
    this.modalCtrl.dismiss({
      category: 'delete'
    });

  }

revokeAccess () {
  this.attachmentService.revokeAcces(this.attachmentId, this.fileName, this.contactId, this.tier, false)
  .subscribe((data) => {
    this.modalCtrl.dismiss({
      index: this.index
    });
    this.revokeAccessMessage ();
  });
}

  cancel () {
    this.modalCtrl.dismiss ();
  }
  categoryCancel(){
    this.modalCtrl.dismiss({
      category: 'cancel'
    });
  }

  async deleteAttachmentMessage () {
    const modal = await this.modalCtrl.create({
 component: ToastComponent,
 cssClass: 'simple-delete-modal',
 componentProps: { deleteMessage: 'attachment' }
 });
    await modal.present();
}

async deleteContactMessage () {
const modal = await this.modalCtrl.create({
component: ToastComponent,
cssClass: 'simple-delete-modal',
componentProps: {  deleteContactMessage: 'contact' }
}, );
await modal.present();


}

async revokeAccessMessage () {
  const modal = await this.modalCtrl.create({
component: ToastComponent,
cssClass: 'simple-delete-modal',
componentProps: {  revokeAccessMessage: 'beneficiary' }
}, );
  await modal.present();
}

deleteUserAccount () {
  this.loadingCtrl.create ();
  this.authService.deleteUserAccount(this.userDetails);
}


}
