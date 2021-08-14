import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AttachmentsService } from './attachments.service';



@Injectable({
  providedIn: 'root'
})
export class ContactServiceService {
  attachments: any = [];
  beneficiary1Id: any = [];
  beneficiary2Id: any = [];
  beneficiary3Id: any = [];
  beneficiary1: any = [];
  contactsStream: BehaviorSubject<any> = new BehaviorSubject([]);
  contact: Array<{name: string, email: string, mobile: string}> = [];
  contacts: any;
  file: any = [];
  userId: string;

  constructor (
    private apiService: ApiService,
    private authService: AuthService,
    private attachmentService: AttachmentsService
    ) {

      this.getContacts ();
      this.authService.currentUser.subscribe(user => this.userId = user._id);

  }

  // Get uploaded contacts from the server through api-service
  getContacts () {
    this.apiService.get({name: 'Contacts'}).subscribe(contacts => {
        this.contactsStream.next(contacts);
    }, error => {
    });
  }

  // Post created or contacts selected from mobile to the server through api-service.
  postContacts (data) {
    return this.apiService.post('Contacts', { contacts: data });

  }

  // Edit contact details in contact-list page
  editContact (contactId, contact) {
    return this.apiService.put(`Contacts/${contactId}`, {contacts: contact});
  }

  // Delete contact from server
  deleteContact (contactId: string) {
    return this.apiService.delete(`Contacts/${contactId}`);
  }

  // Fetch contact details using contactId
   getContactDetailsbyId (contactId: string) {
    const promise = new Promise((resolve, reject) => {
      this.contactsStream.value.forEach((contactInfo) => {
        if (contactInfo._id === contactId) {
          const result = contactInfo;
          resolve ( result);
        }
      });
      reject();
      });
    return promise;
    }

// Fetch contact email using contactId to send email to the contacts from share-details page
getContactEmailById (contactId: string) {
  const promise = new Promise((resolve, reject) => {
    this.contactsStream.value.forEach((contactInfo) => {
      if (contactInfo._id === contactId) {
        resolve(contactInfo.primaryEmail);
      }
    });
    reject();
    });
  return promise;
}

// Check if the contact selected by the user has Email or not
checkIfEmailExists (contactId) {
  const promise = new Promise((resolve, reject) => {
    this.contactsStream.value.forEach((contactInfo) => {
      if (contactInfo._id === contactId) {
        const result = contactInfo;
        if (contactInfo.primaryEmail === '' || contactInfo.primaryEmail === null || contactInfo.primaryEmail === undefined) {
          resolve(result);
        }
      }
    });
    reject();
  });
  return promise;
}

// Get beneficiaries attached to the document
getBeneficiaryById (contactId: string) {
  const promise = new Promise((resolve, reject) => {
    this.attachmentService.attachmentStream.subscribe(data => {
      this.attachments = data;
      this.attachments.forEach((info) => {
        this.file = info;
        this.file.Beneficiary1.forEach((id) => {
          this.beneficiary1Id = id.contactId;
          if (contactId === this.beneficiary1Id ) {
              const result = {fileName: this.file.filename};
              resolve (result);
            }
        });

        this.file.Beneficiary2.forEach((id) => {
          this.beneficiary2Id = id.contactId;
          if ( contactId === this.beneficiary2Id) {
             const result = {fileName: this.file.filename};
             resolve (result);
            }
        });

        this.file.Beneficiary3.forEach((id) => {
          this.beneficiary3Id = id.contactId;
          if ( contactId === this.beneficiary3Id) {
              const result = {fileName: this.file.filename};
              resolve (result);
            }
        });

    });
  });
    reject();
});
  return promise;
}

}
