import { Component, OnInit } from '@angular/core';
import { PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private popover: PopoverController) { }

  ngOnInit() {}
  onDismiss(server: HTMLInputElement): void{
    // this.popover.dismiss();
    this.popover.dismiss({
      'frompopover': server.value
    });
  }
  closePopOver() {
    this.popover.dismiss();
  }

}
