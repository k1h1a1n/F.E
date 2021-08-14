import {  NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AuthService } from './services/auth.service';
import {HttpClientModule} from '@angular/common/http';

import { CacheModule } from 'ionic-cache';
// import { AES_GCM } from 'asmcrypto.js';

import { IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule} from '@ionic/storage';
import { FormsModule, ReactiveFormsModule, ControlContainer } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// imports for File upload, Camera and contacts
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import { FilePath} from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { ContactListPageModule } from './modules/contact-list/contact-list.module';
// import { FileOpener } from '@ionic-native/file-opener/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SharedModule } from './shared/shared.module';
import { ApiService } from './services/api.service';
import { SecureStorage } from '@ionic-native/secure-storage/ngx';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';


import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BnNgIdleService } from 'bn-ng-idle';
import { SignUpPage } from './modules/sign-up/sign-up.page';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { DocumentScanner } from '@ionic-native/document-scanner/ngx';
import { QuillModule } from 'ngx-quill';
import { VerifyOtpPage } from './modules/verify-otp/verify-otp.page';
import { SignUpPageModule } from './modules/sign-up/sign-up.module';
import { VerifyOtpPageModule } from './modules/verify-otp/verify-otp.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    SignUpPageModule,
    HttpClientModule,
    VerifyOtpPageModule,
    IonicModule.forRoot({animated: false}),
    AppRoutingModule,
    FormsModule,
    IonicStorageModule.forRoot(),
    CacheModule.forRoot (),
    ReactiveFormsModule,
    ContactListPageModule,
QuillModule.forRoot(),



  ],
  exports: [],

  providers: [
    AuthService,
    AndroidPermissions,
    ApiService,
    BnNgIdleService,
    Camera,
    GooglePlus,
    Dialogs,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
      JwtHelperService,
    FilePath,
    FileChooser,
    File,
    FileOpener,
    FileTransfer,
    FileTransferObject,
    MediaCapture,
    Media, SecureStorage,
    SocialSharing,
    DocumentScanner,
    // tslint:disable-next-line: deprecation,
    Contacts,
    AES256,
    // AES_GCM,
    LocalNotifications,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule {}
