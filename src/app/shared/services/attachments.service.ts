import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {
  attachmentStream: BehaviorSubject<any> = new BehaviorSubject([]);
  attachments: Array<any>;
  header: HttpHeaders;

  tiersMap = {
    tier1: 'tier 1',
    tier2: 'tier 2',
    tier3: 'tier 3'
};
  token: string;


  constructor (private api: ApiService) {
    // this.getAttachments();
    this.attachmentStream.subscribe(attachments => {
      this.attachments = this.makeForm(attachments);
  });

    this.header = new HttpHeaders({
    'content-type': 'application/json',
    Authorization: this.token,
});
   }

   getAttachments () {
    this.api.get({name: 'myFiles'}).subscribe(attachments => {
        this.attachmentStream.next(attachments);
    }, error => {
    });
}

makeForm (attachments) {
  const form = [];
  attachments.forEach(attachment => {
      const fg = Object.assign({}, attachment, {isEdited: false});
      fg.tiers = new FormGroup({
              tier1: new FormControl(attachment.Beneficiary1.map(c => c.firstName)),
              tier2: new FormControl(attachment.Beneficiary2.map(c => c.contactId)),
              tier3: new FormControl(attachment.Beneficiary3.map(c => c.contactId))
          });

      form.push(fg);
  });

  return form;
}

getBeneficiaries (index) {
}


delete (id: string) {
  return this.api.post(`myfiles/deletefile`, {file: {file_id: id}});
}

addBeneficiary (fileId, fileName, Beneficiaries, status: boolean) {
  const requestType = status ? 'selectTiers' : 'removeTiers';
  return this.api.post(`myFiles/${requestType}`, {file: {file_id: fileId, filename: fileName}, beneficiaries: Beneficiaries } );

}

revokeAcces (fileId, fileName, contactId, tier, status: boolean) {
  const requestType = status ? 'selectTiers' : 'removeTiers';
  return this.api.post(`myFiles/${requestType}`, {file: {file_id: fileId, filename: fileName }, contact: {_id: contactId}, type: tier}  );
}


}
