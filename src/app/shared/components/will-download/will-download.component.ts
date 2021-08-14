import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { ApiService } from 'src/app/services/api.service';
import { DownloadDocumentService } from '../../services/download-document.service';
import { LoadingController } from '@ionic/angular';


declare var window: any;


@Component({
  selector: 'app-will-download',
  templateUrl: './will-download.component.html',
  styleUrls: ['./will-download.component.scss'],
})
export class WillDownloadComponent implements OnInit {

  attachments = [];
  fileId:any;
  fileName:any;
  isEncrypted:boolean;

  constructor(private navService: NavigationService,public apiService: ApiService,
    private downloadDocumentService: DownloadDocumentService,
    public loadingCtrl: LoadingController,
    ) { }

  ngOnInit() {}

  ionViewWillEnter () {
    this.getAttachments();
}

  getAttachments () {
    this.apiService.get({name: 'myFiles'}).subscribe(attachments => {
        this.attachments = attachments;
        console.log(this.attachments.length);
        console.log(this.attachments[0]);
        let lastAtt = this.attachments.length - 1;
        console.log(this.attachments[lastAtt]);
        this.fileId = this.attachments[lastAtt]["file_id"];
        this.fileName = this.attachments[lastAtt]["filename"];
      
    }, error => {
    });

}

  goHome(){
    this.navService.navigateRoot('/home');
  }

 async downloadWill(){
    // this.ViewDocumentComponent.download(this.fileId,this.fileName);
   await this.getAttachments();
    this.download(this.fileId,this.fileName);
  }

  public async download(documentId, filename: string){
    this.downloadDocumentService.checkAndroidPermissions ()
    .then (async (status) => {
      // this.downloadDocumentService.presentSpinner('Download in Progress...');
      await this.downloadDocumentService.downloadFile(documentId, filename, this.isEncrypted)
      .then(async (data) => {
        let fileUrl: string;
        fileUrl = data;
        if(this.isEncrypted!=undefined){
          this.checkEncryption(this.isEncrypted,fileUrl,filename,documentId)
        }else{
          
          this.downloadFile(filename,fileUrl);
        }
        
      })

      
    },
    err =>{
      this.accessDeniedAleart();
    })
  }

  public async downloadwilltest(){
    this.downloadDocumentService.checkAndroidPermissions ()
    .then (async (status) => {
      //     const popover = await this.popOverCtrl.create({
  //       component: WillDisclaimerComponent,
  //       componentProps: {fileId: documentId, filename: filename },
  //       cssClass: 'enterFileDownloadOtp-popover',
  //       });
  //     return await popover.present();
      // this.downloadDocumentService.presentSpinner('Download in Progress...');
      await this.downloadDocumentService.downloadwillFile('')
      .then(async (data) => {
        let fileUrl: string;
        fileUrl = data;
       
          
          this.downloadFile("Resume.pdf",fileUrl);
        
        
      })

      
    },
    err =>{
      this.accessDeniedAleart();
    })
  }

  async checkEncryption(isEncrypted,fileUrl,filename,documentId){
    
         this.downloadFile(filename,fileUrl);
     
  }

  accessDeniedAleart () {
    let newVar: any;
    newVar = window.navigator;
    newVar.notification.alert(
        'Download Failed',   // the message
        function () { },                      // a callback
        'Access Denied',                            // a title
        'OK'                                // the button text
    );
  }

  public downloadFile(filename,fileUrl) {
    this.loadingCtrl.dismiss();
          this.downloadDocumentService.downloadSuccessAlert(filename);
          this.downloadDocumentService.pushNotificationToStatusBar(fileUrl, filename);
  }

}
