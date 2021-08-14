import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();

	/* disable logs in prod mode */
	console.log = function () { };
	console.info = function () { };
	console.error = function () { };
	console.warn = function () { };
}

platformBrowserDynamic().bootstrapModule(AppModule)
	.catch(err => console.log(err));
