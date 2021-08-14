import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { SelectDocumentTypeComponent, ViewDocumentComponent, SetPasswordComponent, DisclaimerComponent, ConfirmPasswordComponent, ShareDetailsComponent, UserEncryptionOptionsComponent, UploadDocumentComponent, CreateContactComponent } from '@durity/components';
import { EncryptDetailsComponent } from './shared/components/signup-wizard/encrypt-details/encrypt-details.component';
import { AddContactsComponent } from './shared/components/signup-wizard/add-contacts/add-contacts.component';
import { SecurityComponent } from './shared/components/signup-wizard/security/security.component';
import { EverythingSetComponent } from './shared/components/signup-wizard/everything-set/everything-set.component';
import { StorePasswordComponent } from './shared/components/store-password/store-password.component';
import { RecommendationsComponent } from './shared/recommendations/recommendations.component';
import { EditContactComponent } from './shared/components/edit-contact/edit-contact.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { TextNoteComponent } from './shared/components/text-note/text-note.component';
import { TextNoteUploadComponent } from './shared/components/text-note-upload/text-note-upload.component';
import { FeedbackComponent } from './shared/components/feedback/feedback.component';
import { FeedbackSubmitComponent } from './shared/components/feedback-submit/feedback-submit.component';
import { FaqsComponent } from './shared/components/faqs/faqs.component';
import { ProfileScreenComponent } from './shared/components/profile-screen/profile-screen.component';
import { UploadProfilePicComponent } from './shared/components/upload-profile-pic/upload-profile-pic.component';
import { WillDisclaimerComponent } from './shared/components/enter-file-download-otp/enter-file-download-otp.component';
import { EnterOTPandDecryptFileComponent } from './shared/components/enter-otpand-decrypt-file/enter-otpand-decrypt-file.component';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import { ContactUsComponent } from './shared/components/contact-us/contact-us.component';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { GenerateWillComponent } from './shared/components/generate-will/generate-will.component';
import { WillDownloadComponent } from './shared/components/will-download/will-download.component';
import { UpgradePlanComponent } from './shared/components/upgrade-plan/upgrade-plan.component';
import { WillDownloadAlertComponent } from './shared/components/will-download-alert/will-download-alert.component';
import { PopoverForAdvisorVerificationComponent } from './shared/components/popover-for-advisor-verification/popover-for-advisor-verification.component';
import { ClientProfileScreenComponent } from './shared/components/client-profile-screen/client-profile-screen.component';
import { AddNewclientForAdvisorComponent } from './shared/components/add-newclient-for-advisor/add-newclient-for-advisor.component';
import { PopoverForClientAdvisorcodeComponent } from './shared/components/popover-for-client-advisorcode/popover-for-client-advisorcode.component';
import { TypeofUserSelectionComponent } from './shared/components/typeof-user-selection/typeof-user-selection.component';
import { PopoverOnTypeofUserComponent } from './shared/components/popover-on-typeof-user/popover-on-typeof-user.component';
import { SelectImagesforPdfuploadComponent } from './shared/components/select-imagesfor-pdfupload/select-imagesfor-pdfupload.component'
import { MicrosurveyComponent } from './shared/components/microsurvey/microsurvey.component';
import { AboutAdvanceEncryptionComponent } from './shared/components/about-advance-encryption/about-advance-encryption.component';
import { ShowFileDetailsComponent } from './shared/components/show-file-details/show-file-details.component';
import { ClaimDocumentComponent} from './shared/components/claim-document/claim-document.component';
import {GoogleSignUpComponent} from './shared/components/google-sign-up/google-sign-up.component';
import { ClaimModalComponent } from './shared/components/claim-modal/claim-modal.component';
import {ChooseSingleContactComponent} from './shared/components/choose-single-contact/choose-single-contact.component';
import { WillComComponent } from './shared/components/signup-wizard/will-com/will-com.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'                    
    },
    {
        path: 'home',
        loadChildren: './modules/home/home.module#HomePageModule'
    },
    {
        path: 'documents',
        loadChildren: './modules/home/home.module#HomePageModule'
    },
    {
        path: 'login',
        loadChildren: './modules/login/login.module#LoginPageModule'
    },
    {
        path: 'sign-up',
        loadChildren: './modules/sign-up/sign-up.module#SignUpPageModule'
    },
    { path: 'login-home', loadChildren: './modules/login-home/login-home.module#LoginHomePageModule' },
    { path: 'document-list', loadChildren: './modules/document-list/document-list.module#DocumentListPageModule' },
    { path: 'contact-list', loadChildren: './modules/contact-list/contact-list.module#ContactListPageModule' },
    { path: 'view-document/:index', component: ViewDocumentComponent},
    { path:'change-password', component:ChangePasswordComponent },
    { path:'settings', component:SettingsComponent},
    { path:'contact-us', component:ContactUsComponent},
    {path: 'recommendations', component: RecommendationsComponent},
    { path: 'select-doc', component: SelectDocumentTypeComponent },
    { path: 'select-doc/:id', component: SelectDocumentTypeComponent },
    {path:'survey', component:MicrosurveyComponent},
    { path: 'encrypt-details', component: EncryptDetailsComponent},
    { path:'enter-file-download-otp', component:WillDisclaimerComponent},
    { path:'enter-otp-decrypt-file', component:EnterOTPandDecryptFileComponent},
    {path: 'add-contacts', component: AddContactsComponent},
    {path: 'will-com', component: WillComComponent},
    { path: 'security', component: SecurityComponent},
    { path: 'everything-set', component: EverythingSetComponent},
    { path: 'set-pass' , component: SetPasswordComponent},
    { path: 'disclaimer', component: DisclaimerComponent},
    { path: 'store-password' , component: StorePasswordComponent},
    {path: 'confirm-pass' , component: ConfirmPasswordComponent},
    {path: 'userencryption-opt' , component: UserEncryptionOptionsComponent},
    {path: 'share-details', component: ShareDetailsComponent},
    { path: 'text-note' , component: TextNoteComponent},
    { path: 'about-advanceencryption', component: AboutAdvanceEncryptionComponent},
    {path: 'upload-document' , component: UploadDocumentComponent},
    { path: 'upload-document/:id', component:  UploadDocumentComponent},
   { path: 'forgot-password', loadChildren: './modules/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
   {path: 'create-contact', component: CreateContactComponent},
   {path: 'edit-contact', component: EditContactComponent},
   { path: 'toast' , component: ToastComponent},
   {path: 'upload-text-note', component: TextNoteUploadComponent},
   { path: 'feedback', component: FeedbackComponent},
   { path: 'feedback-submit', component: FeedbackSubmitComponent},
   { path: 'faqs', component: FaqsComponent},
   { path: 'profile-screen', component: ProfileScreenComponent},
   { path: 'upload-profilePic', component: UploadProfilePicComponent},
   { path: 'generate-will', component: GenerateWillComponent},
   { path: 'will-download', component: WillDownloadComponent},
   { path: 'upgrade-plan', component: UpgradePlanComponent},
   { path: 'will-dwonload-alert', component: WillDownloadAlertComponent},
   { path: 'popover-advisor-verification', component: PopoverForAdvisorVerificationComponent},
   { path: 'client-profile-screen', component: ClientProfileScreenComponent},
   { path: 'add-new-client', component: AddNewclientForAdvisorComponent},
   { path: 'popover-client-advisorcode', component: PopoverForClientAdvisorcodeComponent},
   { path: 'typeof-user-selection', component: TypeofUserSelectionComponent},
   { path: 'popover-typeofuser', component: PopoverOnTypeofUserComponent},
   { path: 'scanned-images-popover', component: SelectImagesforPdfuploadComponent},
   { path: 'show-file-details', component: ShowFileDetailsComponent},
  { path: 'verify-otp', loadChildren: './modules/verify-otp/verify-otp.module#VerifyOtpPageModule' },
  { path: 'claim', component: ClaimDocumentComponent},
  { path: 'verify-google-otp', component: GoogleSignUpComponent},
  { path: 'claim-modal', component:  ClaimModalComponent},
  {path: 'choose-single-contact', component: ChooseSingleContactComponent}


];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
