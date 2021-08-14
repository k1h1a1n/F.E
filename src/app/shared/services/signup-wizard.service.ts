import { SelectDocumentTypeComponent } from '@durity/components';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, ActionSheetController, LoadingController, AlertController, ModalController, PopoverController, Platform } from '@ionic/angular';
import { MediaCapture, MediaFile, CaptureVideoOptions, CaptureImageOptions, CaptureAudioOptions } from '@ionic-native/media-capture/ngx';
import { Media } from '@ionic-native/media/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NavigationService } from './navigation.service';
import { Storage } from '@ionic/storage';
// const MAX_FILE_SIZE = 5 * 1000 * 1024;
import { SecureStorageObject } from '@ionic-native/secure-storage/ngx';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { environment } from 'src/environments/environment';
import { GlobalVariablesService } from 'src/app/services/global-variables.service';
import { ApiService } from 'src/app/services/api.service';
import * as sha1 from 'js-sha1';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentScanner } from '@ionic-native/document-scanner/ngx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// import { SelectImagesforPdfuploadComponent } from '../components/select-imagesfor-pdfupload/select-imagesfor-pdfupload.component';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})
export class SignupWizardService {
    apiUrl = environment.apiUrl;
    public fileDir: any;
    public fileName: any;
    picture: any;
    public name: any;
    selVideo: boolean;
    filename: any;
    videoId: any;
    fileUrl: string;
    token: any;
    userId: string;
    image = [];
    previousData;
    pdfObj;
    scategory;
    private user = new BehaviorSubject<Array<string>>(['no-recepient']);
    public share = this.user.asObservable();
    public fileChecksumValue: any;

    imageName: any;
    selImage: boolean;
    private sStorageObj: SecureStorageObject;
    private secureKey: string;
    private secureIV: string;
    billPhoto: string;
    contentType: string;
    uploadDate: any;
    fileSize: string;
    percentage: number;
    size: number;
   
    addUser (newUser) {
        this.user.next(newUser);
    }

    constructor (public auth: AuthService,
                 public navService: NavigationService,
                 public toastCtrl: ToastController,
                 public Scan: DocumentScanner,
        // tslint:disable-next-line: deprecation
                 private transfer: FileTransfer,
                 private mediaCapture: MediaCapture,
                 private storage: Storage,
                 public globalVariablesProvider: GlobalVariablesService,
                 private media: Media,
                 public fileChooser: FileChooser,
                 public fileOpener: FileOpener,
                 public actionsheetCtrl: ActionSheetController,
                 public filePath: FilePath,
                 public platform: Platform,
                 public loadingCtrl: LoadingController,
                 public camera: Camera,
                 private file: File,
                 public alertCtrl: AlertController,
                 public router: Router,
                 public modalCtrl: ModalController,
                 public popOverCtrl: PopoverController,
                 private aes256: AES256,
                 public route: ActivatedRoute

    ) {
       /*  this.route.paramMap.subscribe((paramMap) => {
        if ( paramMap.has('id')) {
            this.category = paramMap.get('id');
        } else{
            this.category = '';
        }
    }); */
        this.token = this.auth.getToken();
        this.auth.currentUser.subscribe(user => this.userId = user._id);
      }
    

    getUserToken () {
        // api call or token from storage
        return 'testtoken';
    }
    async getFile (accessType: string, category: string) {
        if (this.platform.is('ios')) {
             (<any>window).FilePicker.pickFile((uri) => {
            this.fileName = uri;
            this.filename = uri.substr(uri.lastIndexOf('/') + 1);
            this.name = this.filename;
            this.fileUrl = this.fileName;
                // this.getFileSize (uri, accessType);
            this.navService.navigateForword('/upload-document');
            },
                function (error) {
                },
                function (sucess) {
                });
        } else {
            this.fileChooser.open()
                .then(
                    uri => {
                        this.filePath.resolveNativePath(uri)
                            .then(resolveFilePath => {
                                // this.fileOpener.open(resolveFilePath, 'application/pdf').then(value => {
                                this.fileDir = resolveFilePath;
                                this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                                this.name = this.fileName; // alert('Selected Pdf file');
                                this.fileUrl = this.fileDir;
                                this.file.resolveLocalFilesystemUrl(uri).then((fileEntry: any) => {
                                    fileEntry.file((fileObj) => {
                                        let fileReader = new FileReader();
                                        fileReader.readAsText(fileObj);
                                        fileReader.onload = (e) => {
                                            this.fileChecksumValue = sha1(fileReader.result);
                                        };
                                        // this.size = fileObj.size;
                                        this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                                        if (accessType === 'sign-up') {
                                            this.navService.navigateForword('/upload-document');
                                        } else if(category != '') {
                                            console.log(category);
                                            this.router.navigate(['/upload-document', category]);
                                        } else {
                                            this.navService.navigateForword('/upload-document');
                                        } 
                            

                                    });
                                });
                            }).catch(err => {
                                // alert(JSON.stringify(err));
                                this.alertDismissed();
                            });
                    });
        }
    }

    getFileSize (uri: string, accessType: string) {
        this.file.resolveLocalFilesystemUrl(uri).then((fileEntry: any) => {
            fileEntry.file((fileObj) => {
                let fileReader = new FileReader();
                fileReader.readAsText(fileObj);
                fileReader.onload = (e) => {
                    this.fileChecksumValue = sha1(fileReader.result);
                };
                this.size = fileObj.size;
                this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                if (accessType === 'sign-up') {
                    this.navService.navigateForword('/upload-document');
                } else {
                    this.navService.navigateForword('/upload-document');
                }
            });
    });
    }

    private generateChecksum (file) {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.fileChecksumValue = sha1(fileReader.result);

        };
        fileReader.readAsText(file);

    }

    uploadCamScanPDF(fileDir,filename,blob){
        const savedFileUrl = fileDir + filename;
        this.fileUrl = savedFileUrl;
        this.name = filename
    
            this.navService.navigateForword('/upload-document');
        

    }

    async chooseCameraType(type: string){
        const actionSheet = await this.actionsheetCtrl.create({
            header: 'Choose Upload type',
            buttons: [{
                text: 'Camera',
                role: 'destructive',
                icon: 'assets/imgs/camera12.svg',
                handler: () => {
                    this.takePhoto(type);
                }
            }, {
                text: 'Cam Scanner',
                icon: 'assets/imgs/scann.svg',
                handler: () => {

                  
                    this.methodCallforPdf()
                    // this.openGallery(type);
                    // this.captureImage(1)
                }
            }]
        });
        await actionSheet.present();
    }

    async methodCallforPdf(){
        this.navService.navigateForword('/scanned-images-popover');

        // const modal =  this.popOverCtrl.create({
        //     component: SelectImagesforPdfuploadComponent,
        //     componentProps: {},
        //     cssClass: 'custom-PopOver'
        //   });
        //    (await modal).present();
    }

    // captureImage(val) {
 
    //     const options = {
    //       sourceType : val,
    //       fileName : 'myfile',
    //       quality : 2.5,
    //       returnBase64 : true
    //     };
      
    //     this.Scan.scanDoc(options).then(data => {
    //       this.myData(data);
    //     });
      
    //   }

    async addPhoto (type: string) {
        if (this.platform.is('android')) {
            const actionSheet = await this.actionsheetCtrl.create({
                cssClass: 'my-custom-act-class',
                header: 'Upload Photo',
                buttons: [{
                    text: 'Capture Photo',
                    role: 'destructive',
                    icon: 'assets/imgs/Camera Icon.svg',
                    handler: () => {
                         this.chooseCameraType(type)
                    }
                }, {
                    text: 'Select from Gallery',
                    icon: 'assets/imgs/Gallary Icon12.svg',
                    handler: () => {
                        this.openGallery(type);
                    }
                }]
            });
            await actionSheet.present();
        } else {
            const actionSheet = await this.actionsheetCtrl.create({
                header: 'Select Image source',
                buttons: [{
                    text: 'Load from Library',
                    handler: () => {
                        this.takePictureiOS(this.camera.PictureSourceType.PHOTOLIBRARY, type);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePictureiOS(this.camera.PictureSourceType.CAMERA, type);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
                ]
            });
            await actionSheet.present();
        }
    }
    async caddPhoto (type: string,cam: string) {
        if (this.platform.is('android')) {
            const actionSheet = await this.actionsheetCtrl.create({
                cssClass: 'my-custom-act-class',
                header: 'Upload Photo',
                buttons: [{
                    text: 'Capture Photo',
                    role: 'destructive',
                    icon: 'assets/imgs/Camera Icon.svg',
                    handler: () => {
                        // this.takePhoto(type);
                       this.select(type,cam);
                       // this.chooseCameraType(type)
                    }
                }, {
                    text: 'Select from Gallery',
                    icon: 'assets/imgs/Gallary Icon12.svg',
                    handler: () => {
                        this.openGallery(type);
                    }
                }]
            });
            await actionSheet.present();
        } else {
            const actionSheet = await this.actionsheetCtrl.create({
                header: 'Select Image source',
                buttons: [{
                    text: 'Load from Library',
                    handler: () => {
                        this.takePictureiOS(this.camera.PictureSourceType.PHOTOLIBRARY, type);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.takePictureiOS(this.camera.PictureSourceType.CAMERA, type);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
                ]
            });
            await actionSheet.present();
        }
    }
select(type,cam){
    if(cam ==='photo-camera'){
        this.takePhoto(type);
    }else if(cam ==='photo-camscan'){
        this.methodCallforPdf();
    }
}
    takePhoto (type: string) {
        this.selImage = true;
        const options: CaptureImageOptions = { limit: 1, saveToPhotoAlbum: false };
          this.mediaCapture.captureImage(options)
            .then((imageData: MediaFile[]) => {
                let i, path, len;
                for (i = 0, len = imageData.length; i < len; i += 1) {
                    path = imageData[i].fullPath;
                    this.size = imageData[i].size;
                }
                this.fileName = path;
                this.filename = path.substr(path.lastIndexOf('/') + 1);
                this.name = this.filename;
                this.fileUrl = this.fileName;
                //  let fhgg= path.size;
                this.file.resolveLocalFilesystemUrl(path).then((fileEntry: any) => {
                    fileEntry.file((fileObj) => {
                        this.generateChecksum(fileObj);
                        this.size = fileObj.size;
                        this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                        // this.navService.navigateForword('/upload-document');
                        if (type === 'profilePic') {
                            this.navService.navigateForword('/upload-profilePic');
                        } else {
                            this.navService.navigateForword('/upload-document');
                        } 

                    });
                });
            },
                (err) => {
                    this.alertDismissed();
                });
    }
    openGallery (type: string) {
        this.selImage = false;
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
        };
        this.camera.getPicture(options)
            .then((imageUrl) => {
                this.filePath.resolveNativePath(imageUrl)
                    .then(resolveFilePath => {
                        this.fileDir = resolveFilePath;
                        this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
                        this.name = this.fileName;
                        this.fileUrl = this.fileDir;
                        this.file.resolveLocalFilesystemUrl(imageUrl).then((fileEntry: any) => {
                            fileEntry.file((fileObj) => {
                                this.generateChecksum(fileObj);
                                this.size = fileObj.size;
                                this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                                if (type === 'profilePic') {
                                    this.navService.navigateForword('/upload-profilePic');
                                } else if(this.scategory != '') {
                                    console.log(this.scategory);
                                    this.router.navigate(['/upload-document', this.scategory]);
                                } else {
                                    this.navService.navigateForword('/upload-document');
                                } 
        
                            });
                        });
                    });
            },
                (err) => {
                    this.alertDismissed();
                });
    }
    takePictureiOS (sourceType: PictureSourceType, type: string) {
        var options: CameraOptions = {
            quality: 100,
            sourceType: sourceType,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(imagePath => {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            this.fileName = correctPath;
            this.filename = currentName;
            this.name = this.filename;
            this.fileUrl = this.fileName;
            this.file.resolveLocalFilesystemUrl(imagePath).then((fileEntry: any) => {
                fileEntry.file((fileObj) => {
                    this.generateChecksum(fileObj);
                    this.size = fileObj.size;
                    this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                    // this.navService.navigateForword('/upload-document');
                    if (type === 'profilePic') {
                        this.navService.navigateForword('/upload-profilePic');
                    } else {
                        this.navService.navigateForword('/upload-document');
                    }
                });
            });
        });
    }


    async presentToast (msg) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000
        });
        toast.present();
    }


    async addVideo (acessType: string) {
        if (this.platform.is('android')) {
            const actionSheet = await this.actionsheetCtrl.create({
                header: 'Albums',
                buttons: [{
                    text: 'Capture Video',
                    role: 'destructive',
                    icon: 'camera',
                    handler: () => {
                        this.captureVideo(acessType);
                    }
                }, {
                    text: 'Choose from gallery',
                    icon: 'image',
                    handler: () => {
                        this.selectVideo(acessType);
                    }
                }]
            });
            await actionSheet.present();
        } else {
            const actionSheet = await this.actionsheetCtrl.create({
                header: 'Select Video source',
                buttons: [{
                    text: 'Load from Library',
                    handler: () => {
                        this.selectVideoiOS(this.camera.PictureSourceType.PHOTOLIBRARY, acessType);
                    }
                },
                {
                    text: 'Use Camera',
                    handler: () => {
                        this.captureVideoiOS(this.camera.PictureSourceType.CAMERA, acessType);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
                ]
            });
            await actionSheet.present();

        }

    }
    captureVideo (acessType: string) {
        this.selVideo = false;
        const options: CaptureVideoOptions = { limit: 1, saveToPhotoAlbum: false };
        this.mediaCapture.captureVideo(options)
            .then((videodata: MediaFile[]) => {
                let i, path, len;
                for (i = 0, len = videodata.length; i < len; i += 1) {
                    path = videodata[i].fullPath;
                }
                this.fileName = path;
                this.filename = path.substr(path.lastIndexOf('/') + 1);
                this.name = this.filename;
                this.fileUrl = this.fileName;
                this.fileSize = path.size;
                this.file.resolveLocalFilesystemUrl(path).then((fileEntry: any) => {
                    fileEntry.file((fileObj) => {
                        this.size = fileObj.size;
                        this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                        if (acessType === 'sign-up') {
                            this.navService.navigateForword('/upload-documents');
                        } else {
                            this.navService.navigateForword('/upload-document');
                        } 

                    });
                });

            },
                (err) => {
                    this.alertDismissed();
                });
    }

    selectVideo (acessType: string) {
        this.selVideo = true;
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.FILE_URI,
            mediaType: this.camera.MediaType.VIDEO,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options)
            .then(async (videoUrl) => {
                this.makeFileIntoBlob(videoUrl);
            },
                (err) => {
                    this.alertDismissed();
                });
    }
    selectVideoiOS (sourceType: PictureSourceType, type: string) {
        var options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            mediaType: this.camera.MediaType.VIDEO,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        this.camera.getPicture(options).then(videoUrl => {
            this.name = videoUrl.substring(videoUrl.lastIndexOf('/') + 1);
            this.fileUrl = videoUrl.substring(0, videoUrl.lastIndexOf('/') + 1);
            this.navService.navigateForword('/upload-document');
            // this.makeFileIntoBlob(videoUrl);
        }, err => {
        });

    }

    captureVideoiOS (sourceType: PictureSourceType, type: string) {
        let options: CaptureVideoOptions = {
            limit: 1,
            saveToPhotoAlbum: false
          };
        this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
            let capturedFile = res[0];
            let fileName = capturedFile.name;
            let dir = capturedFile['localURL'].split('/');
            dir.pop();
            let fromDirectory = dir.join('/');      
            var toDirectory = this.file.documentsDirectory;
            this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
            },err => {
              console.log('err: ', err);
            });
                },
          err => console.error(err));

    }

    makeFileIntoBlob (videoUrl) {
        let correctPath = 'file://' + videoUrl;
        this.file.resolveLocalFilesystemUrl(correctPath).then((fileEntry: any) => {
            fileEntry.file((res) => {
                this.readFile(res);
                this.fileSize = (((res.size / 1000) / 1000).toFixed(2));
                this.name = res.name;
                this.fileUrl = correctPath;
                this.navService.navigateForword('/upload-document');
            });
        });
    }
    readFile (file) {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const blob: any = new Blob([reader.result], { type: file.type });
                blob.name = file.name;
                return blob;
            };
            reader.readAsArrayBuffer(file);
        }
    }


    async presentAlert (msg) {
        const alert = await this.alertCtrl.create({

            message: msg,
            buttons: ['OK']
        });
        await alert.present();
    }

    captureAudio (acessType: string) {
        let options: CaptureAudioOptions = {
            limit: 1,
            saveToPhotoAlbum: false
          };
        this.mediaCapture.captureAudio(options)
            .then((audiodata: MediaFile[]) => {
                let i, path, len;
                for (i = 0, len = audiodata.length; i < len; i += 1) {
                    path = audiodata[i].fullPath;
                }
                this.fileName = path;
                this.filename = path.substr(path.lastIndexOf('/') + 1);
                this.name = this.filename;
                this.fileUrl = this.fileName;
                this.file.resolveLocalFilesystemUrl(path).then((fileEntry: any) => {
                    fileEntry.file((fileObj) => {
                        this.size = fileObj.size;
                        this.fileSize = (((fileObj.size / 1000) / 1000).toFixed(2));
                        if (acessType === 'sign-up') {
                            this.navService.navigateForword('/upload-documents');
                        }else {
                            this.navService.navigateForword('/upload-document');
                        } 

                    });
                });
            },
                (err) => {
                    this.alertDismissed();
                });
    }

    alertDismissed () {
        let newVar: any;
        newVar = window.navigator;
        newVar.notification.alert(
            'Document couldnt be uploaded.',   // the message
            function () { },                      // a callback
            'Access Denied',                            // a title
            'OK'                                // the button text
        );
    }

}
