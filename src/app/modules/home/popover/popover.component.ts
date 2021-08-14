import { Component, OnInit } from '@angular/core';
import { PopoverController} from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})


export class PopoverComponent implements OnInit {
  myForm: FormGroup;
  isSubmitted: boolean;
  check: any;

  constructor(private popover: PopoverController) { }

  ngOnInit() {


    this.myForm = new FormGroup({          
      'name':new FormControl(null,Validators.required)
})

  }


  get errorControl() {
    return this.myForm.controls;
  }

  onDismiss(server: HTMLInputElement): void{

    this.isSubmitted = true;
    this.check = server.value.trim();
    console.log(this.check)
  if (!this.myForm.valid || this.check=='') {
    this.isSubmitted=false;
  }
   else
    {  
    // this.popover.dismiss();
    this.popover.dismiss({
      'frompopover': this.check
    });
  }
}
  closePopOver() {
    this.popover.dismiss();
  }

}
