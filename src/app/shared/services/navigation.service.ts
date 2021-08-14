import { Injectable } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    root: any = '/';

    constructor (public nav: NavController, public router: Router, public location: Location, private platform: Platform) { }

    navigateForword (page) {
        const url = this.root + page;
        this.router.navigateByUrl(url);

    }

    registerHomeBackButtonExit () {
        this.platform.backButton.subscribe(() => {

            if (this.router.url === '/home' || this.router.url === '/login'  ) {
                navigator['app'].exitApp();
            }

           });
    }

    navigateBack () {
        this.nav.pop();
    }

    navigateRoot (page, options?: any) {

        const url = this.root + page;
        if (options != null) {
            this.router.navigateByUrl(url, { skipLocationChange: true });
        } else {
            this.nav.navigateRoot(url);
        }

    }

    goto (pageName, data?) {
        if (data) {
            console.log('hi');
            console.log(data);
            const url = this.root + pageName + this.root + data;
            // const url = this.root + pageName;
            console.log(url);
            // this.router.navigate(['/select-doc', data]);
            this.router.navigateByUrl(url);
        } else {
            console.log('bye');
            const url = this.root + pageName;
            this.router.navigateByUrl(url);
        }
       
       
    }
}
