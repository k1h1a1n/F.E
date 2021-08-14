import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-for-client-advisorcode',
  templateUrl: './popover-for-client-advisorcode.component.html',
  styleUrls: ['./popover-for-client-advisorcode.component.scss'],
})
export class PopoverForClientAdvisorcodeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  onSubmit(){
    // this.authService.presentToast('Registration Successfull!');
    // // this.UploadDocumentsService.createWillFile(this.signUpForm.value.name,this.signUpForm.value.email);
    //  this.navService.navigateRoot('/add-contacts');
  }

}
