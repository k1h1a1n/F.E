import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { PopoverController, NavParams, ModalController, AlertController } from '@ionic/angular';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { AuthService } from 'src/app/services/auth.service';
import { UploadDocumentsService } from '../../services/upload-documents.service';
import { DownloadDocumentService } from '../../services/download-document.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { EncryptAndDecryptService } from "src/app/shared/services/encrypt-and-decrypt.service";
import { environment } from 'src/environments/environment';
import * as hash from 'hash.js';
import { Platform } from '@ionic/angular';
@Component({
    selector: 'app-confirm-password',
    templateUrl: './confirm-password.component.html',
    styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent implements OnInit {
    apiUrl: string = environment.apiUrl;
    documentType: string;
    public flagType;
    fileName: string;
    fileUrl: string;
    fileId: string;
     passwordKey: string;
    private savedFile: string;
    textNoteData: any;
    private userId: string;
    token: string;
    header: HttpHeaders;
    configuration: any;
    hybridEncTag: any;
    keyNIV:any;
    userFileEncIv:string;
    userFileEncTag:string;
    hashValue: any;
    enteredPasswordHash: any;
    subscription: any;
    public unregisterBackButtonAction: any;

    constructor (
        private authService: AuthService,
        public alertCtrl: AlertController,
        private modalCtrl: ModalController,
        private downloadDocumentService: DownloadDocumentService,
        private EncryptAndDecryptService: EncryptAndDecryptService,
        private navParams: NavParams,
        private navService: NavigationService,
        public popOverCtrl: PopoverController,
        private uploadDocumentsService: UploadDocumentsService,
        private wizardService: SignupWizardService,
        private http: HttpClient,
        private platform: Platform
    ) {
        this.navService.registerHomeBackButtonExit();
        this.authService.configuration.subscribe((info) => {
           this.configuration = info;
           if (this.configuration.userEncryptionHash === undefined || null) {
                this.hashValue = null;
            } else {
                this.hashValue = this.configuration.userEncryptionHash;
            }

        });


        this.flagType = navParams.get('flagType');
        this.keyNIV = navParams.get('keyNIV');
        this.userFileEncIv = navParams.get('userFileEncIv');
        this.userFileEncTag = navParams.get('userFileEncTag');
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
        this.http.get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, { headers: this.header }).subscribe((res) => {
            this.authService.setAuth(res);
        });
        this.fileName = this.navParams.get('fileName');
        this.fileUrl = this.navParams.get('fileUrl');
        this.documentType = this.navParams.get('documentType');
        this.textNoteData = this.navParams.get('textNoteData');
        this.fileId = this.navParams.get('fileId');
        this.hybridEncTag = this.navParams.get('hybridEncTag');
    }

    uploadEncryptFile () {
        this.navService.navigateForword('/share-details');
        this.modalCtrl.dismiss();
    }

    goBack () {
        this.popOverCtrl.dismiss();
    }

    encryptFile() {
        this.checkKeyAndProceed('encryption');
        this.modalCtrl.dismiss();
    }

    getDecryptedFile() {
        this.checkKeyAndProceed('decryption');
        this.flagType = true;
        this.modalCtrl.dismiss();
    }

    private generateHash (encryptionKey: any): any {
        return hash.sha256().update(encryptionKey).digest('hex');
    }

    private checkKeyAndProceed (processType: string) {
        var PadString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.passwordKey = this.passwordKey.padStart(16,PadString);
        this.enteredPasswordHash = this.generateHash (this.passwordKey);

        // var iv = environment.encryption_iv;
                if (this.hashValue === this.enteredPasswordHash) {
                    if (processType === 'decryption') {

                        // get tag and add to IV
                        // if (this.documentType === 'document') {
                      var res = this.EncryptAndDecryptService.decrypt(this.keyNIV['hybridEncKey'],this.passwordKey, this.userFileEncIv,this.userFileEncTag,false)
                        //  .then((res)=>{
                           
                    this.uploadDocumentsService.decryptFile(this.fileUrl, res,this.keyNIV['hybridEncIv'],this.hybridEncTag, this.fileName, true, false);

                        //  })   
                        // this.uploadDocumentsService.decryptFile(this.fileUrl, this.passwordKey,this.userFileEncIv,this.userFileEncTag, this.fileName, true, true);
                        // } else if (this.documentType === 'text-note') {
                        // }

                    } else if (processType === 'encryption') {
                        if (this.documentType === 'document') {
                            this.uploadDocumentsService.encryptAndUploadFileForBothIosAndAndroid(true, this.passwordKey,true, 'log-in', this.fileName);
                        } else if (this.documentType === 'text-note') {
                            this.uploadDocumentsService.uploadTextNote(true, this.passwordKey, true, 'log-in', this.fileName, this.textNoteData, false);

                        }
                    }

                } else {
                    this.presentAlert();
                }
    }


    async presentAlert () {
        const alert = await this.alertCtrl.create({
            message: 'Please enter valid encryption password.',
            buttons: ['OK']
        });
        await alert.present();
    }

      ionViewDidEnter () {
          this.uploadDocumentsService.backButtonDisable ();
        }
}
