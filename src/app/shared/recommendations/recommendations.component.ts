import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { Route } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss'],
})
export class RecommendationsComponent{

constructor (private navController: NavController, public popOverCtrl: PopoverController) { }

close () {
 this.popOverCtrl.dismiss();
}


}
