import { Injectable, NgZone } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { NavigationService } from "./navigation.service";
import {
  ToastController,
  ActionSheetController,
  LoadingController,
  AlertController,
  ModalController,
  PopoverController,
  Platform,
} from "@ionic/angular";
import { GlobalVariablesService } from "src/app/services/global-variables.service";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
// import { AES256 } from '@ionic-native/aes-256/ngx';
import { EncryptAndDecryptService } from "src/app/shared/services/encrypt-and-decrypt.service";
import { Router } from "@angular/router";
import { FilePath } from "@ionic-native/file-path/ngx";
import {
  FileTransferObject,
  FileTransfer,
  FileUploadOptions,
} from "@ionic-native/file-transfer/ngx";
import { environment } from "src/environments/environment";
import { BehaviorSubject, from } from "rxjs";
import { SecureStorageObject } from "@ionic-native/secure-storage/ngx";
import { Storage } from "@ionic/storage";
import { SignupWizardService } from "./signup-wizard.service";
import { ApiService } from "src/app/services/api.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as hash from "hash.js";
import { DownloadDocumentService } from "./download-document.service";
import * as  forge from 'node-forge';
import { async } from '@angular/core/testing';

declare var JSEncrypt: any;
declare var window: any;


@Injectable({
  providedIn: "root",
})
export class UploadDocumentsService {
  apiUrl = environment.apiUrl;
  hybridAsymmetricDecrypt = new JSEncrypt();
  hybridAsymmetricEnc = new JSEncrypt();
  // hybridSecureKey: any;
  // hybridSecureIV: any;
  hybridEncryptedKey: any;
  hybridEncryptedIV: any;
  contentType: string;
  encryptedTextNoteData: any;
  encryptedFileName: string;
  encryptFileError = false;
  public name: any;
  iOSfileData: any;
  correctPath: string;
  fileData: any;
  fileSize: number;
  filename: string;
  fileName: string;
  fileUrl: string;
  salt: string;
  textNoteData: string;
  textNoteTitle: string;
  token: any;
  private user = new BehaviorSubject<Array<string>>(["no-recepient"]);
  public share = this.user.asObservable();
  private sStorageObj: SecureStorageObject;
  private secureKey: string;
  private secureIV: string;
  alert: any;
  userId: string;
  progress = 0;
  uploadDate: any;
  configurationInfo: any;
  header: HttpHeaders;
  hashValue: string;

  addUser(newUser) {
    this.user.next(newUser);
  }

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private downloadDocsService: DownloadDocumentService,
    public navService: NavigationService,
    public toastCtrl: ToastController,
    // tslint:disable-next-line: deprecation
    private transfer: FileTransfer,
    private EncryptAndDecryptService: EncryptAndDecryptService,
    private http: HttpClient,
    private storage: Storage,
    public globalVariablesProvider: GlobalVariablesService,
    public fileChooser: FileChooser,
    public actionsheetCtrl: ActionSheetController,
    public filePath: FilePath,
    public loadingCtrl: LoadingController,
    private file: File,
    private ngZone: NgZone,
    private wizardService: SignupWizardService,
    public alertCtrl: AlertController,
    public router: Router,
    public modalCtrl: ModalController,
    public popOverCtrl: PopoverController,
    public platform: Platform,
    // private aes256: AES256,
    public signupWizard: SignupWizardService
  ) {
    // this.token = this.authService.getToken();
    this.authService.currentUser.subscribe((user) => {
      this.userId = user._id;
      this.token = user.token;
    });

    this.checkIfEncryptedOnce();
    // this.getKey(16).then((res) => this.hybridSecureKey = res);
    // this.getIV().then((res) => this.hybridSecureIV = res);
    this.authService.currentUser.subscribe((user) => {
      this.userId = user._id;
      this.token = user.token;
      this.header = new HttpHeaders({
        "content-type": "application/json",
        Authorization: this.token,
      });
    });
  }

  // Method to check if the user is encrypting the document for the first time.
  checkIfEncryptedOnce() {
    this.authService.currentUser.subscribe((info) => {
      this.configurationInfo = info.configuration;
           this.hashValue = this.configurationInfo.userEncryption.passwordHash;

   });
    // this.authService.configuration.subscribe((info) => {
    //   this.configurationInfo = info;
    //   this.hashValue = this.configurationInfo.userEncryptionHash; // Hash value exists only if the user has already encrypted one or more documents.
    // });
  }

  options: any = {
    fileName: "",
    beneficiaries: null,
    userDateAndTime: Date(),
    params: {
      originalname: "",
      categoryname: "",
      beneficiaries: this.user.value,
      userDateAndTime: Date(),
      fileSizeInBytes: this.signupWizard.fileSize,
      fileChecksum: this.signupWizard.fileChecksumValue,
      checksumType: "SHA1",
      fileInfo: {
        isEncrypted: true,
        advisorAccess:true,
        encryptionType: "",
        hybridEncKey: "",
        hybridEncIv: "",
        hybridEncVersion: "1",
        hybridEncKeyAndIvForBothEnc: {
          forBiometric: {
            hybridEncKey: "",
            hybridEncIv: "",
          },
          forUserEncKey: {
            hybridEncKey: "",
            hybridEncIv: "",
          },
        },
        originalFileExtension: "",
        fileSizeInBytes: "",
        userFileEncTag: "",
        userFileEncKeyHash: "",
        userFileEncVersion: "1",
        userFileEncIv: "",
        hybridEncTag: "",
        isUserEncrypted: false,
        isBiometricEnabled: false,
        // Add file size in bytes here
      },
    },
  };

  async encryptAndUploadFileForBothIosAndAndroid(
    extraSecurity: boolean,
    encryptionKey: string,
    advisorAccess: boolean,
    acessType: string,
    filename: string,
    isBiometricCall: boolean = false,
    categoryname?: string

  ) {
    this.name = decodeURI(this.wizardService.name);
    this.fileUrl = this.wizardService.fileUrl;
    this.presentSpinner('Encrypting & uploading file...');
    const toast = await this.toastCtrl.create({
      duration: 7000,
      message:
        'Your file is getting encrypted. The upload time will depend on the size of your file.',
    });
    await toast.present();
    this.options.params.originalname = this.options.fileName = filename;
    this.options.params.categoryname = categoryname;
    this.user.subscribe((value) => {
      this.options.beneficiaries = value;
      this.options.params.beneficiaries = value;
    });
    this.options.params.fileInfo.originalFileExtension = this.name
      .split('.')
      .pop();
    this.options.params.fileInfo.advisorAccess = advisorAccess;
    console.log(this.wizardService.fileSize);
    this.options.params.fileInfo.fileSizeInBytes = this.wizardService.fileSize.toString()
    let encryptedData;

    await this.encryptFile(
      this.fileUrl,
      filename,
      encryptionKey,
      extraSecurity,
      isBiometricCall
    ).then(
      (fnEncryptedData) => {
        encryptedData = fnEncryptedData;
      },
      async (err) => {
        //todo remove
        this.encryptFileError = true; // this avoids calling the error in fileTransfer.upload
        await this.loadingCtrl.dismiss();
        await this.signupWizard.alertDismissed();
      }
    );

    //todo remove
    // this.filedata
    if (this.options.params.fileInfo.isBiometricEnabled == true) {
      // promiseMethod(){
      this.waitForHalfSecond().then((value) => {
        this.apiService
          .post("user/files/upload", {
            fileData: encryptedData,
            options: this.options,
          })
          .subscribe(
            (data) => {
              this.afterEncryptAndPostApiNavigation(extraSecurity);
            },
            (err) => {
              if (this.encryptFileError === false) {
                this.presentToast("File with that name already exists");
                this.loadingCtrl.dismiss();
                this.popOverCtrl.dismiss();
              }
            }
          );
      });
      // }
    } else {
      this.apiService
        .post("user/files/upload", {
          fileData: encryptedData,
          options: this.options,
        })
        .subscribe(
          (data) => {
            this.afterEncryptAndPostApiNavigation(extraSecurity);
          },
          (err) => {
            if (this.encryptFileError === false) {
              this.presentToast("File with that name already exists");
              this.loadingCtrl.dismiss();
              this.popOverCtrl.dismiss();
            }
          }
        );
    }
  }

  waitForHalfSecond() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I promise to return after half a second!");
      }, 500);
    });
  }

  private afterEncryptAndPostApiNavigation(extraSecurity: boolean) {
    this.loadingCtrl.dismiss();
    this.presentToast("Document uploaded successfully");
    if (extraSecurity === true && this.hashValue === (null || undefined)) {
      this.navService.navigateForword("/store-password");
    } else if (
      extraSecurity === true &&
      this.hashValue !== (null || undefined)
    ) {
      this.navService.navigateRoot("/share-details");
    } else if (
      extraSecurity !== true &&
      this.globalVariablesProvider.signInType === "register"
    ) {
      this.navService.navigateRoot("/document-list");
    } else {
      this.navService.navigateRoot("/home");
    }
    this.popOverCtrl.dismiss();
  }

  private async encryptFile(
    fileUrl: any,
    filename: string,
    userEncryptionKey: string,
    isUserEncryptionWithUserKey: boolean,
    isBiometricEnabled: boolean
  ) {
    filename = decodeURI(filename);
    var filePathBasedOnOs = this.getFilePathBasedOnOS(fileUrl);
    this.encryptedFileName = filename;
    this.options.params.fileInfo.isUserEncrypted = false;
    this.options.params.fileInfo.isBiometricEnabled = false;
    console.log(filePathBasedOnOs+"****"+this.name)
    var base64Data = await this.readFileAsBase64Data(
      filePathBasedOnOs,
      this.name
    );

    var secondRes = await this.EncryptAndDecryptService.encryptNoKeysPassed(
      base64Data
    );

    if (isUserEncryptionWithUserKey == true && isBiometricEnabled == false) {
      secondRes[2] = await this.firstRoundEncryptionWithUserKeyAndPostKeyValuesToServer(
        secondRes[2],
        userEncryptionKey
      );
    }

    this.correctPath = filePathBasedOnOs;
    this.options.params.fileInfo.hybridEncTag = secondRes[1];
    this.options.params.fileInfo.isEncrypted = true;
    this.options.params.fileInfo.encryptionType = "AES-GCM";
    this.options.params.fileInfo.hybridEncVersion = "1";

    if (isBiometricEnabled == true && isUserEncryptionWithUserKey == false) {
      this.options.params.fileInfo.isBiometricEnabled = true;
      // todo the same for text note upload
      await window.cordova.plugins.CustomBiometricPlugin.encrypt(
        secondRes[2],
        "mdurity",
        async (res) => {
          this.options.params.fileInfo.isBiometricEnabled = true;
          var keyNIv = await this.EncryptAndDecryptService.encryptRndKeyAndIV(
            res,
            secondRes[3]
          );
          this.options.params.fileInfo.hybridEncKey = keyNIv[0];
          this.options.params.fileInfo.hybridEncIv = keyNIv[1];
        },
        (e) => console.error(e)
      );
    } else if (
      isBiometricEnabled == true &&
      isUserEncryptionWithUserKey == true
    ) {
      let encryptedRndKeyWIthUserKey = await this.firstRoundEncryptionWithUserKeyAndPostKeyValuesToServer(
        secondRes[2],
        userEncryptionKey
      );

      var keyNIvForUserKeyEnc = this.EncryptAndDecryptService.encryptRndKeyAndIV(
        encryptedRndKeyWIthUserKey,
        secondRes[3]
      );

      this.options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forUserEncKey.hybridEncKey = keyNIvForUserKeyEnc[0];
      this.options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forUserEncKey.hybridEncIv = keyNIvForUserKeyEnc[1];

      this.options.params.fileInfo.isBiometricEnabled = true;
      // todo the same for text note upload
      await window.cordova.plugins.CustomBiometricPlugin.encrypt(
        secondRes[2],
        "mdurity",
        async (res) => {
          this.options.params.fileInfo.isBiometricEnabled = true;
          var keyNIvForBiometricEnc = await this.EncryptAndDecryptService.encryptRndKeyAndIV(
            res,
            secondRes[3]
          );
          this.options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forBiometric.hybridEncKey = keyNIvForBiometricEnc[0];
          this.options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forBiometric.hybridEncIv = keyNIvForBiometricEnc[1];
        },
        (e) => console.error(e)
      );
    } else {
      var keyNIv = this.EncryptAndDecryptService.encryptRndKeyAndIV(
        secondRes[2],
        secondRes[3]
      );

      this.options.params.fileInfo.hybridEncKey = keyNIv[0];
      this.options.params.fileInfo.hybridEncIv = keyNIv[1];
      // return secondRes[0];
    }

    return secondRes[0];
  }

  async firstRoundEncryptionWithUserKeyAndPostKeyValuesToServer(
    rndKey,
    userEncryptionKey
  ) {
    var res = await this.EncryptAndDecryptService.encryptEncKeyPassed(
      rndKey,
      userEncryptionKey
    );

    this.options.params.fileInfo.isUserEncrypted = true;
    this.options.params.fileInfo.userFileEncVersion = "1";
    this.options.params.fileInfo.userFileEncTag = res[1];
    this.options.params.fileInfo.userFileEncIv = res[2];
    this.options.params.fileInfo.userFileEncKeyHash = res[3];

    //todo remove this--> insecure code
    this.postHashToServer(userEncryptionKey);

    return res[0];
  }

  public addDevicForBiometric(userDeviceDetails) {
    this.apiService.post("devices/addDevice", userDeviceDetails).subscribe();
  }

  public getFilePathBasedOnOS(fileUrl) {
    var filePathBasedOnOs;

    if (this.platform.is("ios")) {
      if (fileUrl.substring(0, 4) === "file") {
        filePathBasedOnOs = fileUrl.substring(0, fileUrl.lastIndexOf("/") + 1);
      } else {
        filePathBasedOnOs =
          "file:///" + fileUrl.substring(0, fileUrl.lastIndexOf("/") + 1);
      }
    } else {
      // filePathBasedOnOs = this.filePath.resolveNativePath(fileUrl);
      filePathBasedOnOs = fileUrl;
      const temp = filePathBasedOnOs.split("/");
      const nameFile = temp.pop();
      filePathBasedOnOs = decodeURI(temp.join("/") + "/");
    }

    return filePathBasedOnOs;
  }

  public async readFileAsBase64Data(filePathBasedOnOs, filename) {
    let base4Data;
    await this.file
      .readAsDataURL(filePathBasedOnOs, filename)
      .then((fnBase64Data) => {
        console.log(fnBase64Data)
        base4Data = fnBase64Data;
        
      });
    return base4Data;
  }

  async uploadTextNote(
    extraSecurity: boolean,
    encryptionKey: string,
    advisorAccess: boolean,
    acessType: string,
    filename: string,
    data: any,
    isBiometricEnabled: boolean
  ) {
    this.textNoteData = data;

    let options = {
      file: {
        title: filename + ".html",
        data: this.textNoteData,
      },
      beneficiaries: this.user.value,
      userDateAndTime: Date(),
      params: {
        fileInfo: {
          isEncrypted: true,
          encryptionType: "",
          hybridEncKey: "",
          hybridEncIv: "",
          advisorAccess:advisorAccess,
          hybridEncVersion: "1",
          userFileEncTag: "",
          hybridEncKeyAndIvForBothEnc: {
            forBiometric: {
              hybridEncKey: "",
              hybridEncIv: "",
            },
            forUserEncKey: {
              hybridEncKey: "",
              hybridEncIv: "",
            },
          },
          userFileEncKeyHash: "",
          userFileEncVersion: "1",
          userFileEncIv: "",
          hybridEncTag: "",
          isUserEncrypted: false,
          isBiometricEnabled: false,

          // originalFileExtension: this.name.split('.').pop(),
          // Add file size in bytes here
        },
      },
    };

    // options.params.fileInfo.isUserEncrypted = false;
    // options.params.fileInfo.isBiometricEnabled = false;

    var secondRes = await this.EncryptAndDecryptService.encryptNoKeysPassed(
      this.textNoteData
    );

    if (extraSecurity == true && isBiometricEnabled == false) {
      var userEncryptedTextResponse = await this.encryptTextNote(
        secondRes[2],
        encryptionKey
      );
      // this.textNoteData = userEncryptedTextResponse[0];
      // options.file.title = filename + ".html.encrypt";
      // options.file.data = this.textNoteData;
      secondRes[2] = userEncryptedTextResponse[0];
      options.params.fileInfo.isUserEncrypted = true;
      options.params.fileInfo.userFileEncVersion = "1";
      options.params.fileInfo.userFileEncTag = userEncryptedTextResponse[1];
      options.params.fileInfo.userFileEncIv = userEncryptedTextResponse[2];
      options.params.fileInfo.userFileEncKeyHash = userEncryptedTextResponse[3];
    }

    options.file.data = secondRes[0];
    options.params.fileInfo.hybridEncTag = secondRes[1];
    //  .then(res => {

    if (isBiometricEnabled == true && extraSecurity == false) {
      options.params.fileInfo.isBiometricEnabled = true;
      // todo the same for text note upload
      await window.cordova.plugins.CustomBiometricPlugin.encrypt(
        secondRes[2],
        "mdurity",
        async (res) => {
          // options.params.fileInfo.isBiometricEnabled = true;
          var keyNIv = await this.EncryptAndDecryptService.encryptRndKeyAndIV(
            res,
            secondRes[3]
          );
          options.params.fileInfo.hybridEncKey = keyNIv[0];
          options.params.fileInfo.hybridEncIv = keyNIv[1];
        },
        (e) => console.error(e)
      );
    }
    else if (
      isBiometricEnabled == true &&
      extraSecurity == true
    ) {
      let encryptedRndKeyWIthUserKey = 
      await this.encryptTextNote(
        secondRes[2],
        encryptionKey
      );
      // this.textNoteData = userEncryptedTextResponse[0];
      // options.file.title = filename + ".html.encrypt";
      // options.file.data = this.textNoteData;
      // secondRes[2] = encryptedRndKeyWIthUserKey[0];
      options.params.fileInfo.isUserEncrypted = true;
      options.params.fileInfo.userFileEncVersion = "1";
      options.params.fileInfo.userFileEncTag = encryptedRndKeyWIthUserKey[1];
      options.params.fileInfo.userFileEncIv = encryptedRndKeyWIthUserKey[2];
      options.params.fileInfo.userFileEncKeyHash = encryptedRndKeyWIthUserKey[3];

      var keyNIvForUserKeyEnc = this.EncryptAndDecryptService.encryptRndKeyAndIV(
        encryptedRndKeyWIthUserKey[0],
        secondRes[3]
      );

      options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forUserEncKey.hybridEncKey = keyNIvForUserKeyEnc[0];
      options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forUserEncKey.hybridEncIv = keyNIvForUserKeyEnc[1];

      this.options.params.fileInfo.isBiometricEnabled = true;

      options.params.fileInfo.isBiometricEnabled = true;
      // todo the same for text note upload
      await window.cordova.plugins.CustomBiometricPlugin.encrypt(
        secondRes[2],
        "mdurity",
        async (res) => {
          // options.params.fileInfo.isBiometricEnabled = true;
          var keyNIvForBiometricEnc = await this.EncryptAndDecryptService.encryptRndKeyAndIV(
            res,
            secondRes[3]
          );
          // options.params.fileInfo.hybridEncKey = keyNIv[0];
          // options.params.fileInfo.hybridEncIv = keyNIv[1];
          options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forBiometric.hybridEncKey = keyNIvForBiometricEnc[0];
          options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forBiometric.hybridEncIv = keyNIvForBiometricEnc[1];
       
        },
        (e) => console.error(e)
      );
      // todo the same for text note upload
      // await window.cordova.plugins.CustomBiometricPlugin.encrypt(
      //   secondRes[2],
      //   "mdurity",
      //   async (res) => {
      //     this.options.params.fileInfo.isBiometricEnabled = true;
      //     var keyNIvForBiometricEnc = await this.EncryptAndDecryptService.encryptRndKeyAndIV(
      //       res,
      //       secondRes[3]
      //     );
      //     this.options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forBiometric.hybridEncKey = keyNIvForBiometricEnc[0];
      //     this.options.params.fileInfo.hybridEncKeyAndIvForBothEnc.forBiometric.hybridEncIv = keyNIvForBiometricEnc[1];
      //   },
      //   (e) => console.error(e)
      // );
    } 
    
    else {
      var keyNIv = this.EncryptAndDecryptService.encryptRndKeyAndIV(
        secondRes[2],
        secondRes[3]
      );

      options.params.fileInfo.hybridEncKey = keyNIv[0];
      options.params.fileInfo.hybridEncIv = keyNIv[1];
      // return secondRes[0];
    }
    // const keyNIv = this.EncryptAndDecryptService.encryptRndKeyAndIV(
    //   secondRes[2],
    //   secondRes[3]
    // );
    options.params.fileInfo.encryptionType = "AES-GCM";
    options.params.fileInfo.hybridEncVersion = "1";
    // options.params.fileInfo.hybridEncKey = keyNIv[0];
    // options.params.fileInfo.hybridEncIv = keyNIv[1];
    // });

    // if(this.options.params.fileInfo.isBiometricEnabled == true){
    // promiseMethod(){
    this.waitForHalfSecond().then((value) => {
      this.apiService.post("user/postNotes", options).subscribe(
        (res) => {
          this.loadingCtrl.dismiss();
          if (
            extraSecurity === true &&
            this.hashValue === (null || undefined)
          ) {
            this.navService.navigateForword("/store-password");
          } else if (
            extraSecurity === true &&
            this.hashValue !== (null || undefined)
          ) {
            this.navService.navigateRoot("/share-details");
          } else if (
            extraSecurity !== true &&
            this.globalVariablesProvider.signInType === "register"
          ) {
            this.navService.navigateRoot("/document-list");
          } else {
            this.navService.navigateRoot("/home");
          }
          this.popOverCtrl.dismiss();
        },
        (err) => {
          this.presentToast("File with that name already exists");
          this.loadingCtrl.dismiss();
          // this.toastCtrl.dismiss('Document uploaded successfully')
          this.popOverCtrl.dismiss();
        }
      );
    });
    // }else{

    //   }
  }
  public createWillFile(username, useremail) {
    this.http
      .get(
        `${this.apiService.apiUrl}/getPersonalisedWill?name=${username}&email=${useremail}`,
        { headers: this.header }
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
  postHashToServer(encryptionKey: string) {
    //todo add PBKDF2
    const passwordHashValue = this.generateHash(encryptionKey);
    this.apiService
      .post("user/setUserEncryptionPasswordHash", {
        userEncryption: {
          passwordHashAlgorithm: "SHA-256",
          passwordHash: passwordHashValue,
          salt: this.salt
        },
      })
      .subscribe((data) => {
        this.http
          .get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {
            headers: this.header,
          })
          .subscribe((res) => {
            this.authService.setAuth(res);
          });
      });
  }

  postTagToServer(encryptionKey: string, tag: string) {
    //todo add PBKDF2
    const passwordHashValue = this.generateHash(encryptionKey) + ":tag:" + tag;
    this.apiService
      .post("myfile/setUserEncryptionPasswordHash", {
        userEncryption: {
          passwordHashAlgorithm: "SHA-256",
          passwordHash: passwordHashValue,
          salt: this.salt

        },
      })
      .subscribe((data) => {
        this.http
          .get(`${this.apiUrl}/user/getuserinfo?user_id=${this.userId}`, {
            headers: this.header,
          })
          .subscribe((res) => {
            this.authService.setAuth(res);
          });
      });
  }

  async generateSecureKeyAndIV(encryptionKey: string) {
    var secureKeyAndIV = this.EncryptAndDecryptService.generateSecureKeyAndIV(
      encryptionKey
    );
    this.secureIV = secureKeyAndIV[0];
    this.secureKey = secureKeyAndIV[1];
  }

  // generating passwordHash
  private generateHash(encryptionKey: any): any {
     this.salt=  this.generateSalt();
    return hash.sha256().update(encryptionKey+this.salt).digest("hex");
  }

  public generateSalt() {
    return forge.util.encode64(forge.random.getBytesSync(16));
  }

  //todo remove
  private encryptFileOld(
    fileUrl: any,
    filename: string,
    encryptionKey: string,
    encryptionIv: string,
    isUserEncryption: boolean
  ): any {
    this.encryptedFileName = filename;
    if (this.platform.is("ios")) {
      if (fileUrl.substring(0, 4) === "file") {
        this.correctPath = fileUrl.substring(0, fileUrl.lastIndexOf("/") + 1);
      } else {
        this.correctPath =
          "file:///" + fileUrl.substring(0, fileUrl.lastIndexOf("/") + 1);
      }
      var self = this;
      // let correctPath = fileUrl.substring(0, fileUrl.lastIndexOf('/') + 1);
      return self.file
        .readAsDataURL(this.correctPath, filename)
        .then((result) => {
          this.iOSfileData = JSON.stringify(result);
          var res = this.EncryptAndDecryptService.encryptWithKeyPassed(
            result,
            encryptionKey,
            encryptionIv
          );

          this.fileData = res[0];
          encryptionIv = res[1];
          const encryFile = filename.split(".")[0];
          //TODO check for myblob
          const myblob = new Blob([res[0]], {
            type: "application/pdf",
          });
          res = null;
          const extension = isUserEncryption ? ".encrypt" : "";
          return this.file.dataDirectory + filename + "" + extension;
        })
        .catch((err) => {
          console.log("err4" + JSON.stringify(err));
        });
    } else {
      return this.EncryptionInplatformAndroid(
        fileUrl,
        filename,
        encryptionKey,
        encryptionIv,
        isUserEncryption
      );
    }
  }

  EncryptionInplatformAndroid(
    fileUrl: any,
    filename: string,
    encryptionKey: string,
    encryptionIv: string,
    isUserEncryption: boolean
  ) {
    return this.filePath.resolveNativePath(fileUrl).then((filePath) => {
      const temp = filePath.split("/");
      const nameFile = temp.pop();
      return this.file.readAsDataURL(temp.join("/") + "/", nameFile).then(
        (base64Data) => {
          var res = this.EncryptAndDecryptService.encryptWithKeyPassed(
            base64Data,
            encryptionKey,
            encryptionIv
          );

          this.fileData = res[0];
          encryptionIv = res[1];
          const encryFile = nameFile.split(".")[0];
          res = null;
          const extension = isUserEncryption ? ".encrypt" : "";

          var fileurl =
            this.file.externalRootDirectory +
            "Download/" +
            nameFile +
            "" +
            extension;

          return [
            this.file.externalRootDirectory +
              "Download/" +
              nameFile +
              "" +
              extension,
            encryptionIv,
          ];
        },
        (error) => console.log(error)
      );
    });
  }

  private async encryptTextNote(base64Data, userEncryptionKey) {
    var res = await this.EncryptAndDecryptService.encryptEncKeyPassed(
      base64Data,
      userEncryptionKey
    );
    this.postHashToServer(userEncryptionKey);
    return res;
  }

  // here is the method is used to get content type of an bas64 data
  public decryptFile(
    fileUrl: string,
    decryptionKey: string,
    decryptionIv: string,
    decryptionTag: string,
    filename: string,
    isUserEncryption: boolean,
    isSecondDecryptCall: boolean = false,
    isBiometricDecryptCall: boolean = false
  ) {
    let metaDataPresent = true;
    let dataBlob: any;
    let decryptFileName: string;
    if (isUserEncryption === true || isBiometricDecryptCall === true) {
      this.downloadDocsService.presentSpinner(
        "Please wait! We are decrypting..."
      );
    }
    if (this.platform.is("android")) {
      const url = this.file.externalRootDirectory + "Download/";
      return this.filePath.resolveNativePath(fileUrl).then((filePath) => {
        const temp = filePath.split("/");
        const nameFile = temp.pop();
        return this.file.readAsText(temp.join("/") + "/", nameFile).then(
          async (cipher) => {
            var dataInBinary = false;
            if (
              isSecondDecryptCall == true &&
              nameFile.includes(".html.encrypt") == false
            ) {
              //todo the file is saved as binary in the first call
              // decrypt is expecting a string, so a conversion has to happen
              await this.file
                .readAsDataURL(temp.join("/") + "/", nameFile)
                .then((secondCipher) => {
                  cipher = secondCipher.split(";base64,").pop();
                });
            }

            var dataBase64 = this.EncryptAndDecryptService.decrypt(
              cipher,
              decryptionKey,
              decryptionIv,
              decryptionTag,
              dataInBinary
            );

            if (
              nameFile.includes(".html") ||
              nameFile.includes(".html.encrypt")
            ) {
              metaDataPresent = false;
            }
            decryptFileName = nameFile;
            // ? nameFile.substring(0, nameFile.lastIndexOf("."))
            // : nameFile;
            // decryptFileName = isUserEncryption
            //   ? nameFile.substring(0, nameFile.lastIndexOf("."))
            //   : nameFile;
            if (metaDataPresent == true) {
              const info = this.getContentType(dataBase64);
              if (info[0] === "null") {
                info[0] = "application/pdf";
              }
              dataBlob = this.base64toBlob(
                dataBase64.substring(info[1]),
                info[0],
                nameFile
              ); // sending the file content
            } else {
              dataBlob = dataBase64;
            }
            return this.file
              .writeExistingFile(url, decryptFileName, dataBlob)
              .then(
                (data) => {
                  if (isUserEncryption === true) {
                    this.loadingCtrl.dismiss();
                    const savedFileUrl =
                      this.file.externalRootDirectory +
                      "Download/" +
                      decryptFileName;
                    this.downloadDocsService.successDecryptAndDownload(
                      savedFileUrl,
                      decryptFileName
                    );
                    this.downloadDocsService.pushNotificationToStatusBar(
                      savedFileUrl,
                      decryptFileName
                    );
                    return decryptFileName;
                  }
                  return decryptFileName;
                },
                (error) => {
                  this.downloadDocsService.failedtoDecryptAndDownload(
                    decryptFileName
                  );
                  return error;
                }
              );
            // });
          },
          (error) => {
            return error;
          }
        );
      });
    } else {
      var self = this;
      const temp = fileUrl.split("/");
      const nameFile = temp.pop();
      const url = this.file.dataDirectory;
      // let correctPath = fileUrl.substring(0, fileUrl.lastIndexOf('/') + 1);
      return self.file
        .readAsText(temp.join("/") + "/", nameFile)
        .then((cipher) => {
          // this.iOSfileData = JSON.stringify(cipher)
          var dataInBinary = false;
          if (isSecondDecryptCall) {
            //todo the file is saved as binary in the first call
            // decrypt is expecting a string, so a conversion has to happen
            dataInBinary = true;
          }
          var dataBase64 = this.EncryptAndDecryptService.decrypt(
            cipher,
            decryptionKey,
            decryptionIv,
            decryptionTag,
            dataInBinary
          );
          if (
            nameFile.includes(".html") ||
            nameFile.includes(".html.encrypt")
          ) {
            metaDataPresent = false;
          }
          decryptFileName = isUserEncryption
            ? nameFile.substring(0, nameFile.lastIndexOf("."))
            : nameFile;
          if (metaDataPresent) {
            const info = this.getContentType(dataBase64);
            if (info[0] === "null") {
              info[0] = "application/pdf";
            }
            dataBlob = this.base64toBlob(
              dataBase64.substring(info[1]),
              info[0],
              nameFile
            ); // sending the file content
            // return this.file.writeExistingFile(url, decryptFileName, dataBlob).then(
          } else {
            dataBlob = dataBase64;
          }
          return this.file
            .writeExistingFile(url, decryptFileName, dataBlob)
            .then(
              (data) => {
                if (isUserEncryption === true) {
                  this.loadingCtrl.dismiss();
                  const savedFileUrl =
                    this.file.dataDirectory + decryptFileName;
                  this.downloadDocsService.successDecryptAndDownload(
                    savedFileUrl,
                    decryptFileName
                  );
                  this.downloadDocsService.pushNotificationToStatusBar(
                    savedFileUrl,
                    decryptFileName
                  );
                  return decryptFileName;
                }
                return decryptFileName;
              },
              (error) => {
                this.downloadDocsService.failedtoDecryptAndDownload(
                  decryptFileName
                );
                return error;
              }
            );
          // })
          // .catch((error: any) => console.error(error));
        })
        .catch((err) => {});
    }
  }
  public getContentType(base64Data: any) {
    const block = base64Data.substring(0, base64Data.indexOf(",") + 1);
    const contentType = block.split(";")[0].split(":")[1];
    return [contentType, block.length];
  }

  // here is the method is used to convert base64 data to blob data
  public base64toBlob(b64Data: string, contentType: string, filename: string) {
    const temp = filename.split(".");
    const fileExtension = temp[temp.length - 2].concat(
      "." + temp[temp.length - 1]
    );
    if (filename.substring(filename.lastIndexOf(".") + 1) === "html") {
      return b64Data;
    } else if (fileExtension === "html.encrypt") {
      return b64Data;
    } else {
      contentType = contentType || "";
      const sliceSize = 512;
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, {
        type: contentType,
      });
      return blob;
    }
  }

  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
    });
    toast.present();
  }

  async dismissToast() {
    this.toastCtrl.create({
      message: "Document uploaded successfully",
      duration: 1000,
    });
  }

  async presentSpinner(data: string) {
    const loader = await this.loadingCtrl.create({
      message: data,
    });
    return (await loader).present();
  }

  // To disable hardware back button while uploading a document from set and confirm password screens
  backButtonDisable() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener(
          "backbutton",
          function (event) {
            event.preventDefault();
            event.stopPropagation();
          },
          false
        );
      });
    });
  }
}
