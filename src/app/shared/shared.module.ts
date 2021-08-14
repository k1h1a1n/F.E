import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import {UploadDocumentComponent, ChooseContactsComponent, ConfirmPasswordComponent, CreateContactComponent, UserEncryptionOptionsComponent,
     SelectDocumentTypeComponent, SetPasswordComponent, ShareDetailsComponent, DisclaimerComponent, ViewDocumentComponent } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityComponent } from './components/signup-wizard/security/security.component';
import { EncryptDetailsComponent } from './components/signup-wizard/encrypt-details/encrypt-details.component';
import { EverythingSetComponent } from './components/signup-wizard/everything-set/everything-set.component';
import { StorePasswordComponent } from './components/store-password/store-password.component';
import { TextNoteComponent } from './components/text-note/text-note.component';
import { EncryptionPopoverComponent } from './components/signup-wizard/encryption-popover/encryption-popover.component';
import { SocialSharingComponent } from './components/social-sharing/social-sharing.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { AddContactsComponent } from './components/signup-wizard/add-contacts/add-contacts.component';
import { WillComComponent } from './components/signup-wizard/will-com/will-com.component';
import { DeletePopoverComponent } from './components/delete-popover/delete-popover.component';
import { EditContactComponent } from './components/edit-contact/edit-contact.component';
import { AddContactEmailComponent } from './components/add-contact-email/add-contact-email.component';
import { ToastComponent } from './components/toast/toast.component';
import { TextNoteUploadComponent } from './components/text-note-upload/text-note-upload.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { FeedbackSubmitComponent } from './components/feedback-submit/feedback-submit.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { WillDisclaimerComponent } from './components/enter-file-download-otp/enter-file-download-otp.component';
import { EnterOTPandDecryptFileComponent } from './components/enter-otpand-decrypt-file/enter-otpand-decrypt-file.component';
import { ProfileScreenComponent } from './components/profile-screen/profile-screen.component';
import { ProfileSubmitComponent } from './components/profile-submit/profile-submit.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { UploadProfilePicComponent } from './components/upload-profile-pic/upload-profile-pic.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { SettingsComponent } from './components/settings/settings.component';
import { GenerateWillComponent} from './components/generate-will/generate-will.component';
import { WillDownloadComponent } from './components/will-download/will-download.component';
import { UpgradePlanComponent } from './components/upgrade-plan/upgrade-plan.component';
import { WillDownloadAlertComponent } from './components/will-download-alert/will-download-alert.component';
import { AddAdvisorComponent } from './components/add-advisor/add-advisor.component';
import { PopoverForAdvisorVerificationComponent } from './components/popover-for-advisor-verification/popover-for-advisor-verification.component';
import { ClientProfileScreenComponent } from './components/client-profile-screen/client-profile-screen.component';
import { AddNewclientForAdvisorComponent } from './components/add-newclient-for-advisor/add-newclient-for-advisor.component';
import { PopoverForClientAdvisorcodeComponent } from './components/popover-for-client-advisorcode/popover-for-client-advisorcode.component';
import { TypeofUserSelectionComponent } from './components/typeof-user-selection/typeof-user-selection.component';
import { PopoverOnTypeofUserComponent } from './components/popover-on-typeof-user/popover-on-typeof-user.component';
import { SelectImagesforPdfuploadComponent } from './components/select-imagesfor-pdfupload/select-imagesfor-pdfupload.component';
import { QuillModule } from 'ngx-quill'
import { MicrosurveyComponent } from './components/microsurvey/microsurvey.component';
import { AboutAdvanceEncryptionComponent } from './components/about-advance-encryption/about-advance-encryption.component';
import { ShowFileDetailsComponent } from './components/show-file-details/show-file-details.component';
import { ClaimDocumentComponent} from './components/claim-document/claim-document.component';
import { GoogleSignUpComponent} from './components/google-sign-up/google-sign-up.component';
import { ClaimModalComponent } from './components/claim-modal/claim-modal.component';
import {ChooseSingleContactComponent} from './components/choose-single-contact/choose-single-contact.component';
import {UpgradePopoverComponent} from './components/upgrade-popover/upgrade-popover.component';

@NgModule({
    declarations: [ AddContactsComponent,WillComComponent, EverythingSetComponent, EncryptDetailsComponent, SecurityComponent, ShareDetailsComponent,
        UploadDocumentComponent, DeletePopoverComponent, EditContactComponent, AddContactEmailComponent,UserEncryptionOptionsComponent,
        ChooseContactsComponent, ConfirmPasswordComponent, CreateContactComponent, RecommendationsComponent,
        SelectDocumentTypeComponent, SetPasswordComponent, ShareDetailsComponent, TextNoteUploadComponent,EnterOTPandDecryptFileComponent,
        DisclaimerComponent, ViewDocumentComponent, ToastComponent, UploadProfilePicComponent,WillDisclaimerComponent,
        StorePasswordComponent, EncryptionPopoverComponent, TextNoteComponent, SocialSharingComponent, FeedbackComponent, FeedbackSubmitComponent,
         FaqsComponent, ProfileScreenComponent, ProfileSubmitComponent, UpdateProfileComponent, ChangePasswordComponent, ContactUsComponent, 
         SettingsComponent,GenerateWillComponent,WillDownloadComponent,UpgradePlanComponent,WillDownloadAlertComponent, AddAdvisorComponent,
          PopoverForAdvisorVerificationComponent, ClientProfileScreenComponent, AddNewclientForAdvisorComponent, MicrosurveyComponent,
          PopoverForClientAdvisorcodeComponent, TypeofUserSelectionComponent, PopoverOnTypeofUserComponent, SelectImagesforPdfuploadComponent,
          AboutAdvanceEncryptionComponent, ShowFileDetailsComponent, ClaimDocumentComponent, GoogleSignUpComponent, ClaimModalComponent,
          ChooseSingleContactComponent, UpgradePopoverComponent
    ],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        QuillModule.forRoot(),

    ],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        IonicModule, AddContactsComponent,WillComComponent, SecurityComponent, EverythingSetComponent, EncryptDetailsComponent, ShareDetailsComponent,
        CommonModule, UploadDocumentComponent, DeletePopoverComponent, EditContactComponent, AddContactEmailComponent, ToastComponent,
        ChooseContactsComponent, ConfirmPasswordComponent, EncryptionPopoverComponent, RecommendationsComponent, TextNoteUploadComponent,
        CreateContactComponent, SelectDocumentTypeComponent, SetPasswordComponent, ShareDetailsComponent,UserEncryptionOptionsComponent,
        DisclaimerComponent, ViewDocumentComponent, UploadProfilePicComponent,WillDisclaimerComponent,EnterOTPandDecryptFileComponent,
        StorePasswordComponent, TextNoteComponent, EncryptionPopoverComponent, SocialSharingComponent, FeedbackComponent, FeedbackSubmitComponent, 
        FaqsComponent, ProfileScreenComponent, ProfileSubmitComponent, UpdateProfileComponent, ChangePasswordComponent, ContactUsComponent,
        SettingsComponent,GenerateWillComponent,WillDownloadComponent, UpgradePlanComponent, WillDownloadAlertComponent, AddAdvisorComponent,
         PopoverForAdvisorVerificationComponent, ClientProfileScreenComponent, AddNewclientForAdvisorComponent,MicrosurveyComponent,
         PopoverForClientAdvisorcodeComponent, TypeofUserSelectionComponent, PopoverOnTypeofUserComponent, SelectImagesforPdfuploadComponent,
         AboutAdvanceEncryptionComponent, ShowFileDetailsComponent, ClaimDocumentComponent, GoogleSignUpComponent, ClaimModalComponent,
         ChooseSingleContactComponent, UpgradePopoverComponent
    ],
    providers: [],
    entryComponents: [ AddContactsComponent,WillComComponent, SecurityComponent, EverythingSetComponent, EncryptDetailsComponent, ShareDetailsComponent,
        UploadDocumentComponent, RecommendationsComponent, DeletePopoverComponent, EditContactComponent, AddContactEmailComponent, ToastComponent,
        ChooseContactsComponent,  ConfirmPasswordComponent, CreateContactComponent, EncryptionPopoverComponent, TextNoteUploadComponent,
         SelectDocumentTypeComponent, SetPasswordComponent, ShareDetailsComponent,WillDisclaimerComponent,EnterOTPandDecryptFileComponent,
        DisclaimerComponent, ViewDocumentComponent, UploadProfilePicComponent,UserEncryptionOptionsComponent,
        StorePasswordComponent, TextNoteComponent, EncryptionPopoverComponent, SocialSharingComponent, FeedbackSubmitComponent, FeedbackComponent,
        FaqsComponent, ProfileScreenComponent, ProfileSubmitComponent, UpdateProfileComponent, ChangePasswordComponent, ContactUsComponent, 
        SettingsComponent,GenerateWillComponent,WillDownloadComponent, UpgradePlanComponent, WillDownloadAlertComponent, AddAdvisorComponent, 
        PopoverForAdvisorVerificationComponent, ClientProfileScreenComponent, AddNewclientForAdvisorComponent,MicrosurveyComponent,
         PopoverForClientAdvisorcodeComponent, TypeofUserSelectionComponent, PopoverOnTypeofUserComponent, SelectImagesforPdfuploadComponent,
         AboutAdvanceEncryptionComponent, ShowFileDetailsComponent, ClaimDocumentComponent, GoogleSignUpComponent, ClaimModalComponent,
         ChooseSingleContactComponent, UpgradePopoverComponent
    ]
})
export class SharedModule { }
