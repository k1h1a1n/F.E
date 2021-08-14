import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  public addBeneficiaries: boolean;
  public editContact: boolean;
  public encryptFile: boolean;
  // public extraSecurity: boolean;
  public fileSize: string;
  public header: HttpHeaders;
  public httpOptions: { headers: HttpHeaders; };
  public signInType: string;
  public textNote: boolean;
  public token: string;
  public uploadType: string;
  public userId: string;
  public isUserEncryptionEnabled: boolean;
  public signupProcessCompleted: boolean;
  public addMoreContacts: boolean;
  public isUserAclient: boolean = false;


  constructor (
  ) {


   }
}
