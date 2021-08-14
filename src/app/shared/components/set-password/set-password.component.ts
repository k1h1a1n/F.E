import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PopoverController, NavParams, Platform } from '@ionic/angular';
import { NavigationService } from '@durity/services';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { UploadDocumentsService } from '../../services/upload-documents.service';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-set-password',
    templateUrl: './set-password.component.html',
    styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent implements OnInit {
    apiUrl: string = environment.apiUrl;
     encryptionKey: string;
    @ Input () fileName;
    @ Input () textNoteData;
    @ Input () documentType;
    passwordShown = false;
    @ViewChild('f', {static: false}) form: any;
    passwordType = 'password';
    passwordIcon = 'eye-off';
    private sStorageObj: any;
    hashValue: string;
    userId: string;
    token: string;
    header: HttpHeaders;

    constructor (
        private apiService: ApiService,
        private authService: AuthService,
        public popOverCtrl: PopoverController,
        private navService: NavigationService,
        private wizardService: SignupWizardService,
        private uploadDocumentsService: UploadDocumentsService,
        private navParams: NavParams,
        private http: HttpClient,
        private platform: Platform
                 ) {
                    this.navService.registerHomeBackButtonExit();
                    this.authService.currentUser.subscribe((user) => {
                        this.userId = user._id;
                        this.token = user.token;
                        this.header = new HttpHeaders({
                         'content-type': 'application/json',
                         Authorization: this.token,
                     });
                     });
    }


    ngOnInit () {
    }

    showPassword () {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';

    }

     onProceed () {
        if (this.form.valid) {
            
            var PadString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            this.encryptionKey = this.encryptionKey.padStart(16,PadString);
           
            if (this.documentType === 'document') {
                this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(true, this.encryptionKey,true, 'sign-up', this.fileName);
            } else {
                this.uploadDocumentsService.uploadTextNote(true, this.encryptionKey,true, 'sign-up', this.fileName, this.textNoteData, false);
            }

    }
}

ionViewDidEnter () {
    this.uploadDocumentsService.backButtonDisable();
}

}
