import { ClaimModalComponent } from './../claim-modal/claim-modal.component';
import { LoadingController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-claim-document',
  templateUrl: './claim-document.component.html',
  styleUrls: ['./claim-document.component.scss'],
})
export class ClaimDocumentComponent implements OnInit {
  apiUrl: string = environment.apiUrl;

  claimUsForm: FormGroup;
  profileId: string;
  property: boolean = true;
  formScreen: number = 1;
  public fileName: any;
  loader: any;
  fileUrl: string;
  header: HttpHeaders;
  token:string;
  fileDir: string;
  name: any;
  base64OfFile: any;
 
  constructor (private navService: NavigationService, private authService: AuthService,
               private fb: FormBuilder, public fileChooser: FileChooser, public filePath: FilePath, private http: HttpClient,
               public loadingCtrl: LoadingController, private file: File, public modalCtrl: ModalController) {
   this.claimUsForm = this.fb.group({
    DurityId : new FormControl('', [Validators.required]),
    BeneDuriId:  new FormControl('', [Validators.required,
            Validators.minLength(6), Validators.maxLength(8)]),
    AadharId: new FormControl('', [Validators.required,
      Validators.minLength(12), Validators.maxLength(12)]),
    BenefactorId : ['', [Validators.required,
      Validators.minLength(12), Validators.maxLength(12)]],
    DeathCertificate: ['', Validators.required],
    checkBox: ['', Validators.requiredTrue]
  });
  }
  ngOnInit () {
      this.authService.currentUser.subscribe((user) => {
      this.profileId = user.durity_id;
      this.claimUsForm.get('DurityId').setValue(this.profileId);
      this.token = user.token;
     
      this.header = new HttpHeaders({
        "content-type": "application/json",
        Authorization: this.token,
      });
    });
  }

  goBack () {
    if (this.formScreen === 1) {
      this.navService.navigateBack();
    } else {
      this.formScreen = 1;
    }
  }
  goHome () {
    this.navService.navigateForword('home');
  }
  submitForm () { 
    
    if (this.claimUsForm.valid) {
      
    let data = {
    DurityId : this.profileId,
    BeneDuriId : this.claimUsForm.value.BeneDuriId,
    AadharId : this.claimUsForm.value.AadharId,
    BenefactorId : this.claimUsForm.value.BenefactorId,
    DeathCertificate : this.base64OfFile
    }
    // console.log(this.data.DeathCertificate);
    this.http
    .post(`${this.apiUrl}/claim/claimDocument`,data, {
      headers: this.header,
    })
    .subscribe((res) => {
      this.navService.navigateBack();
    });
    // this.formScreen = this.formScreen + 1;
    this.navigate();
    }
  }

    async navigate () {
      const modal = await this.modalCtrl.create({
        component: ClaimModalComponent,
        componentProps: {
        }
      });
      await modal.present();
    }
    // this.navService.navigateForword('home');
  
  public async readFileAsBase64Data(filePathBasedOnOs, filename) {
    let base4Data;
    await this.file
      .readAsDataURL(filePathBasedOnOs, filename)
        .then( fnBase64Data => {
           base4Data = fnBase64Data;
        }, err => {
          console.log(err);
        });
    return base4Data;
  }
    
  fileUpload () {
    this.fileChooser.open()
      .then(
        uri => {
        this.filePath.resolveNativePath(uri)
            .then(async (resolveFilePath) => {
              this.loader = await this.loadingCtrl.create({
                message: 'Uploading...'
              });
              (await this.loader).present();
              this.fileDir = resolveFilePath;
              this.fileName = resolveFilePath.substring(resolveFilePath.lastIndexOf('/') + 1);
              this.name = this.fileName;
              this.claimUsForm.get('DeathCertificate').setValue(this.name);
              this.fileUrl = this.fileDir;
              let filePathBasedOnOs = this.fileUrl;
              const temp = filePathBasedOnOs.split("/");
              const nameFile = temp.pop();
              filePathBasedOnOs = decodeURI(temp.join("/") + "/");
              this.base64OfFile = await this.readFileAsBase64Data(filePathBasedOnOs, this.name);
              console.log(this.base64OfFile);
              this.loader.dismiss();
              }).catch(err => {
                // alert(JSON.stringify(err));
                // this.alertDismissed();
            });
      });
  }
}

