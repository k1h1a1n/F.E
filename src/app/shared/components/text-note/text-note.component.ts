import { Component, OnInit } from '@angular/core';
import { LoadingController, PopoverController, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NavigationService, UserService } from '@durity/services';
import { UploadDocumentComponent } from '../upload-document/upload-document.component';
import { UploadDocumentsService } from '../../services/upload-documents.service';


@Component({
  selector: 'app-text-note',
  templateUrl: './text-note.component.html',
  styleUrls: ['./text-note.component.scss'],
})
export class TextNoteComponent implements OnInit {
  content: string;
  textForm: FormGroup;
  textFileData: string;
  textFileName: string;
  savedText: string;


  constructor (private fb: FormBuilder,
               private auth: AuthService,
               public  modalCtrl: ModalController,
               private navService: NavigationService,
               private userService: UserService,
               public popOverCtrl: PopoverController,
               private uploadDocsService: UploadDocumentsService,
               private apiService: ApiService, public loadingCtrl: LoadingController,
               private router: Router
  ) {


   }

  ngOnInit () {

       this.textForm = this.fb.group({
      title: ['', Validators.required],
      data: ['', Validators.required]
    });
  }

  async  onSubmit () {
    if (this.textForm.valid) {
      this.uploadDocsService.textNoteTitle = this.textForm.value.title;
      this.uploadDocsService.textNoteData = this.textForm.value.data;
      this.navService.navigateForword('upload-text-note');
     }
  }


  cancel () {
    this.navService.navigateForword(['/select-doc']);
  }



  async presentModal () {
    const modal = await this.modalCtrl.create({
      component: UploadDocumentComponent,
      componentProps: {textFileData: this.textFileData , textFileName: this.textFileName, savedText: this.savedText},
    });
    await modal.present();
    modal.onDidDismiss().then(data => {
    });
  }
}
