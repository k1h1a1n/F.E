import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { NavigationService } from './navigation.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
@Injectable({
    providedIn: 'root'
})
export class UserService {
    public fileDir: any;
    public fileName: any;
    public name: any;
    selVideo: boolean;
    filename: any;
    videoId: any;
    fileUrl: string;
    token: any;
    userId: string;
    imageName: any;
    public docname: any;
    public selImage: boolean;
    public Imagename: any;
    private user = new BehaviorSubject<Array<string>>(['No recipient']);
    public share = this.user.asObservable();
    currentDate: string;
    billPhoto: string;
    contentType: string;
    blob: Blob;
    invoiceBlob: any;
    beneficiary: any;
    textNoteTitle: string;
    textNoteData: any;

    addUser (newUser) {
        this.user.next(newUser);
    }

    constructor (
        private api: ApiService,
        private localNotifications: LocalNotifications,
        private fileOpener: FileOpener ,
        public auth: AuthService,
        public toastCtrl: ToastController,
        private transfer: FileTransfer,
        public loadingCtrl: LoadingController,
        private file: File,
        private http: HttpClient,
        private navService: NavigationService,
        private apiService: ApiService,
        public alertCtrl: AlertController
        ) {

    }

    getUserToken () {
        // api call or token from storage
        return 'testtoken';
    }



    uploadTextNote (title: string, data) {
    }


}

