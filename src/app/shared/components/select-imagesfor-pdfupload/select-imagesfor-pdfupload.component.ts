import { Component, OnInit } from '@angular/core';
import { SignupWizardService } from '../../services/signup-wizard.service';
import { Platform, NavController } from '@ionic/angular';
import { File} from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentScanner } from '@ionic-native/document-scanner/ngx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FilePath } from '@ionic-native/file-path/ngx';


@Component({
  selector: 'app-select-imagesfor-pdfupload',
  templateUrl: './select-imagesfor-pdfupload.component.html',
  styleUrls: ['./select-imagesfor-pdfupload.component.scss'],
})
export class SelectImagesforPdfuploadComponent implements OnInit {
  image = [];
  pdfObj;
  previousData;

  constructor(private wizardService: SignupWizardService,
   public platform: Platform,
   public Scan: DocumentScanner,
   private file: File,
   public filePath: FilePath,
   private fileOpener: FileOpener) { 
    // this.image = wizardService.image
  }

  ionViewWillEnter() {
    // this.captureImage(1)

  }

  ngOnInit() {
    this.captureImage(1)
    // this.platform.ready().then(() => this.onDeviceReady());
  
  
  }
  captureImage(val) {
   
    const options = {
      sourceType : val,
      fileName : 'myfile',
      quality : 2.5,
      returnBase64 : true
    };
  
    this.Scan.scanDoc(options).then(data => {
      this.myData(data);
    });
  
  }
  upload(val) {
    
    const options = {
      sourceType : val,
      fileName : 'myfile',
      quality : 2.5,
      returnBase64 : true
    };
  
    this.Scan.scanDoc(options).then(data => {
      this.myData(data);
    });
    console.log(this.previousData);
  }
  myData(val) {
    const win: any = window;
    const fit = [600, 600];
    const image = 'data:image/png;base64,' +  val;
    this.image.push({ image, fit});
    this.previousData = this.image;
  }
  public SavePDF() {
    const data = new Array();
    const myData = new Array();
  
  
  
    const docDefenition = {
        header: [
          {text: 'Durity Private Limited'}
        ],
  
        content: [
        ],
        styles: {
          header: {
          text: {
            alignment: 'right'
          },
          bold: true,
          fontSize: 50,
          alignment: 'center',
          background: 'blue'
          },
          sub_header: {
          fontSize: 18,
          alignment: 'right'
          },
          content: {
           
            padding: 20,
            image: {
            fit: [100, 100]
            }
          }
          },
      };
    for (const image of this.image) {
        docDefenition.content.push(image);
  
        console.log(docDefenition);
        this.pdfObj = pdfMake.createPdf(docDefenition);
        // pdfMake.createPdf(docDefenition).getBlob(buffer => {

        //   this.filePath.resolveNativePath(buffer)
        //   .then(resolveFilePath => {
        //     console.log("FilePath : ",resolveFilePath)
        //   })
              
        // });
      }
    this.image = null;

    this.pdfObj.download();
  
    if (this.platform.is('cordova')) {
      this.pdfObj.download();
      this.pdfObj.getBuffer(buffer => {
        const utf8 = new Uint8Array(buffer);
        const binaryArray = utf8.buffer;
        const blob = new Blob([binaryArray], {type: 'application/pdf'});
        this.file.writeFile(this.file.dataDirectory, 'Durity.pdf', blob, {replace: true}).then(fileEntry => {
          // this.fileOpener.open(this.file.dataDirectory + 'Durity.pdf', 'application/pdf');
          this.wizardService.uploadCamScanPDF(this.file.dataDirectory, 'Durity.pdf', blob);
        });
      });
    } else {
      this.pdfObj.download();
    }
  }
  
  printPriview() {
    if (this.platform.is('cordova')) {
  
      this.pdfObj.getBuffer(buffer => {
        const utf8 = new Uint8Array(buffer);
        const binaryArray = utf8.buffer;
        const blob = new Blob([binaryArray], {type: 'application/pdf'});
        this.file.writeFile(this.file.dataDirectory, 'Durity.pdf', blob, {replace: true}).then(fileEntry => {
          this.fileOpener.open(this.file.dataDirectory + 'Durity.pdf', 'application/pdf');
        });
      });
    } else {
      this.pdfObj.download();
    }
  }
  
  // onDeviceReady(){
  
  // }
  
  }
