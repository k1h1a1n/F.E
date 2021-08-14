import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
})
export class FaqsComponent implements OnInit {

  constructor(public navService: NavigationService) { }

  goto (pageName, data?) {
    this.navService.goto(pageName, data);
  }

  ngOnInit() {}

}
