import { Component, OnInit } from '@angular/core';
import { NavigationService } from '@durity/services';
import { MenuController } from '@ionic/angular';


@Component({
    selector: 'app-login-home',
    templateUrl: './login-home.page.html',
    styleUrls: ['./login-home.page.scss'],
})
export class LoginHomePage implements OnInit {

    constructor (public navService: NavigationService ,
                 public menu: MenuController) {
        this.menu.swipeEnable(false);
     }

    ngOnInit () {
    }

    goto (page) {
        switch (page) {
            case 'signUp':
                this.navService.navigateRoot('sign-up');
                break;
            case 'signIn':
                this.navService.navigateRoot('login');
                break;

            default:
                break;
        }
    }

}
