import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, NavController, LoadingController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-show-file-details',
  templateUrl: './show-file-details.component.html',
  styleUrls: ['./show-file-details.component.scss'],
})
export class ShowFileDetailsComponent implements OnInit {
  fileName:any;
  filesize:any;
  fileextension:any;
  uploadedDate:any;
  category:any;
  constructor( private popOverCtrl: PopoverController,  private navParams: NavParams,

    ) {
      this.fileName=navParams.get('filename');
      this.filesize=navParams.get('filesize');
      this.fileextension=navParams.get('ext');
      this.uploadedDate=navParams.get('uploadedDate');
      this.category=navParams.get('category');
     }

  ngOnInit() {}

  closePopOver() {
    
    this.popOverCtrl.dismiss();
  }

}
