import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController, Platform } from '@ionic/angular';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { AuthService } from 'src/app/services/auth.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ApiService } from 'src/app/services/api.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { File } from '@ionic-native/file/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DownloadDocumentService {
  apiUrl: string = environment.apiUrl;
  token: any;
  userId: string;
  keyNIv :any;
  header: HttpHeaders;
  isVerified: Boolean=false;
​
  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private androidPermissions: AndroidPermissions,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private fileTransfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    private loadingCtrl: LoadingController,
    private localNotifications: LocalNotifications,
    private platform: Platform,
    private toastCtrl: ToastController,
  ) {
    // this.token = this.authService.getToken();
    this.authService.currentUser.subscribe((user) => {
      this.userId = user._id;
      this.token = user.token;
      this.header = new HttpHeaders({
        'content-type': 'application/json',
        Authorization: this.token,
      });
    });
​
    this.localNotifications.on('click').subscribe(res => {
      const imagePath = res.data ? res.data.mydata : '';
      const mimeType = this.getMimeType(imagePath);
      if (mimeType) {
        this.fileOpener.open(imagePath, mimeType)
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      } else {
        this.presentToast('Can\'t open file');
      }
    }, (err) => {
    });
​
  }
​
  async presentToast (msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
​
  async presentAlert (msg) {
    const alert = await this.alertCtrl.create({
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
​
  async getKeysByFileId (id: string) {
      return await this.apiService.get({ name: 'user/getkeysbyid/' + id }).toPromise();
  }
​
public async verifyOtpAndGetKeysByFileId( id:string, otp: string, telephoneNumber:string){
  
  await this.apiService.post('user/verifyOTPandGetKeysById', {fileId:id,mobileNumber:telephoneNumber,otp:otp }).subscribe(async (data) => {
   
    this.isVerified=true;
    this.keyNIv=data;
   
}), (error: any) => {
 this.isVerified=false;
}
  //  return isVerified
}
​
  public downloadFile(id, filename: string, isEncrypted:boolean) {
    this.checkPermissions();
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const downloadUrl = `${this.apiService.apiUrl}/user/getFileById/${id}`;
    console.log(downloadUrl)
     let path = this.file.dataDirectory;
    // filename.replace(':', '-');
    const savedFileUrl = this.file.externalRootDirectory + 'Download/' + filename;
    // const options: FileUploadOptions = {
    //   headers: { Authorization: this.token }
    // };
    let options = {
      headers: { Authorization: this.token }
    }
    if (this.platform.is('ios')) {
      return fileTransfer.download(downloadUrl,
        this.file.dataDirectory + filename,
        true, options).then(entry => {
          let url = entry.toURL();
          return this.file.dataDirectory + filename;
        }, async (error) => {
          return error;
        });
    } else {
      return fileTransfer.download(downloadUrl, savedFileUrl, true, options)
        .then(async (entry) => {
          return savedFileUrl;
        }, async (error) => {
          return error;
        });
    }
  }

  public downloadwillFile(email) {
    this.checkPermissions();
    const fileTransfer: FileTransferObject = this.fileTransfer.create();
    const downloadUrl = `${this.apiService.apiUrl}/user/getWillFile?useremail=${email}`;
    let path = this.file.dataDirectory;
    // filename.replace(':', '-');
    const savedFileUrl = this.file.externalRootDirectory + 'Download/' + "Will-"+email+".pdf";
    // const options: FileUploadOptions = {
    //   headers: { Authorization: this.token }
    // };
    let options = {
      headers: { Authorization: this.token }
    }
    if (this.platform.is('ios')) {
      return fileTransfer.download(downloadUrl,
        this.file.dataDirectory + "Resume.pdf",
        true, options).then(entry => {
          let url = entry.toURL();
          return this.file.dataDirectory + "Resume.pdf";
        }, async (error) => {
          return error;
        });
    } else {
      return fileTransfer.download(downloadUrl, savedFileUrl, true, options)
        .then(async (entry) => {
          return savedFileUrl;
        }, async (error) => {
          return error;
        });
    }
  }
  
​
  checkPermissions () {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]
    );
  }
​
  downloadProgress () {
​
  }
​
​
  checkAndroidPermissions () {
    const promise = new Promise((resolve, reject) => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then((status) => {
          if (status.hasPermission === true) {
            return resolve(status.hasPermission);
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
              .then(res => {
                this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
                  .then(data => {
                    if (data.hasPermission === true) {
                      return resolve(data.hasPermission);
                    } else {
                      return reject(data.hasPermission);
                    }
                  });
              }, err => {
              });
          }
        }, err => {
        });
    });
    return promise;
  }
​
​
  // Alert showing successfully decrypted and downloadded
  successDecryptAndDownload (savedFileUrl: string, filename: string) {
    this.downloadSuccessAlert(filename);
    this.pushNotificationToStatusBar(savedFileUrl, filename);
  }
​
  // Alert showing failed to decrypt
  failedtoDecryptAndDownload (filename: string) {
    this.downloadFailedAlert(filename);
​
  }
​
  async downloadSuccessAlert (filename: string) {
    const alertSuccess = this.alertCtrl.create({
      header: `Download Succeeded!`,
      subHeader: `${filename} was successfully downloaded`,
      buttons: ['Ok']
    });
    return (await alertSuccess).present();
​
  }
​
  async downloadFailedAlert (filename: string) {
    const alertFailure = this.alertCtrl.create({
      header: `Download Failed!`,
      subHeader: `${filename} was not successfully downloaded`,
      buttons: ['Ok']
    });
    return (await alertFailure).present();
​
  }
​
  async presentSpinner (data: string) {
    const loader = await this.loadingCtrl.create({
      message: data
    });
    return (await loader).present();
  }
​
  pushNotificationToStatusBar (savedFilepath: string, fileName: string) {
    this.localNotifications.schedule({
      id: 1,
      title: fileName,
      icon: 'res://mipmap-ldpi/ic_launcher.png',
      smallIcon: 'res://mipmap-ldpi/ic_launcher.png',
      text: 'Download completed',
      data: { mydata: savedFilepath }
    });
  }
​
  getMimeType (path: string) {
    let extension = path.split('.').reverse()[0];
    extension = extension.toLowerCase();
    const MIMETypes = {
      aac: 'audio/aac',
      abw: 'application/x-abiword',
      arc: 'application/x-freearc',
      avi: 'video/x-msvideo',
      azw: 'application/vnd.amazon.ebook',
      bin: 'application/octet-stream',
      bmp: 'image/bmp',
      bz: 'application/x-bzip',
      bz2: 'application/x-bzip2',
      csh: 'application/x-csh',
      css: 'text/css',
      csv: 'text/csv',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      eot: 'application/vnd.ms-fontobject',
      epub: 'application/epub+zip',
      gif: 'image/gif',
      htm: 'text/html',
      html: 'text/html',
      ico: 'image/vnd.microsoft.icon',
      ics: 'text/calendar',
      jar: 'application/java-archive',
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      js: 'text/javascript',
      json: 'application/json',
      jsonld: 'application/ld+json',
      mid: 'audio/midi',
      midi: 'audio/midi',
      mjs: 'text/javascript',
      mp3: 'audio/mpeg',
      m4a: 'audio/mpeg',
      mp4: 'video/mp4',
      mpeg: 'video/mpeg',
      mpkg: 'application/vnd.apple.installer+xml',
      odp: 'application/vnd.oasis.opendocument.presentation',
      ods: 'application/vnd.oasis.opendocument.spreadsheet',
      odt: 'application/vnd.oasis.opendocument.text',
      oga: 'audio/ogg',
      ogv: 'video/ogg',
      ogx: 'application/ogg',
      otf: 'font/otf',
      png: 'image/png',
      pdf: 'application/pdf',
      ppt: 'application/vnd.ms-powerpoint',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      rar: 'application/x-rar-compressed',
      rtf: 'application/rtf',
      sh: 'application/x-sh',
      svg: 'image/svg+xml',
      swf: 'application/x-shockwave-flash',
      tar: 'application/x-tar',
      tif: 'image/tiff',
      tiff: 'image/tiff',
      ttf: 'font/ttf',
      txt: 'text/plain',
      vsd: 'application/vnd.visio',
      wav: 'audio/wav',
      weba: 'audio/webm',
      webm: 'video/webm',
      webp: 'image/webp',
      woff: 'font/woff',
      woff2: 'font/woff2',
      xhtml: 'application/xhtml+xml',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      xml: 'application/xml&nbsp;',
      xul: 'application/vnd.mozilla.xul+xml',
      zip: 'application/zip',
      '3gp': 'video/3gpp',
      '3g2': 'video/3gpp2',
      '7z': 'application/x-7z-compressed'
    };
    return MIMETypes[extension];
  }
​
}
​
