import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from '@durity/services';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-for-advisor-verification',
  templateUrl: './popover-for-advisor-verification.component.html',
  styleUrls: ['./popover-for-advisor-verification.component.scss'],
})
export class PopoverForAdvisorVerificationComponent implements OnInit {

  constructor(
    private navService: NavigationService,
        private authService: AuthService,
        public popOverCtrl: PopoverController,
  ) { }

  ngOnInit() {}

  onPressedOK(){
    this.authService.presentToast('Registration Successfull!');
    this.popOverCtrl.dismiss();
    // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
     this.navService.navigateRoot('/add-contacts');
  }

}
