import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotPassForm: FormGroup;
  sentTempPwd: Boolean = false;

  constructor (
               private navService: NavigationService,
               private formBuilder: FormBuilder,
               private authService: AuthService) { }

  ngOnInit () {
    this.forgotPassForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  continue () {
    if (this.forgotPassForm.valid){
    this.authService.attemptAuth('forgot' , this.forgotPassForm.value).then(res => {
      // this.navService.navigateRoot('login');
      this.sentTempPwd = true;
  }).catch(err => {

  });
}
}

clickOk(){
  this.navService.navigateRoot('login');
}

 goBack () {
    this.navService.navigateRoot(['/login']);
  }
}


