import { CaptureError } from '@ionic-native/media-capture/ngx';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Userrecords } from './../../modules/home/userrecords.model';
import { v4 as uuid } from 'uuid';
@Injectable({
  providedIn: 'root'
  }
)
export class RecordsService {
  private userRecords: Userrecords[] = [];
  private arrayRecords = new Subject<Userrecords[]>();
  apiUrl: string = environment.apiUrl;
  public header: HttpHeaders;
  userId: string;
  token: string;
  constructor (private http: HttpClient, private auth: AuthService, private apiService: ApiService) {
    this.auth.currentUser.subscribe((user) => { 
      this.userId = user._id;
      this.token = user.token;
      this.header = new HttpHeaders({
        'content-type': 'application/json',
        Authorization: this.token,
      });
     
    });
  }

  getUserRecords(): any {
    this.apiService.get({name: 'myrecords'})
    .pipe(map((recordData) => {
      console.log(recordData);
      return recordData.records.map((record: any) => {
        return {
          category: record.category,
          property: record.property,
          _id:record._id
        };
      });
    }))
    .subscribe(recordData => {
      this.userRecords = recordData;
      this.arrayRecords.next([...this.userRecords]);
    })
  }
  getRecordUpdateListener () {
    return this.arrayRecords.asObservable();
  }
  deleteUserCategory (popcategory: string,pop_id:string): any {
    const catrecord: Userrecords = {category: popcategory, property: false,_id:pop_id};
    this.apiService.post('user/deletecategory', {catrecord})
    .subscribe((recordData) => {
      //this.getUserRecords();
      const updatedRecords =  this.userRecords.filter(res => res.category !== popcategory || res._id !== pop_id);
      this.userRecords = updatedRecords;
      this.arrayRecords.next([...this.userRecords]);
    });
  }
  postRecords (popcategory: string) {
  const catrecord: Userrecords = {category: popcategory, property: false,_id:uuid()};
  this.apiService.post('myrecords', {catrecord})
  .subscribe(() => {
    // this.getUserRecords();
     this.userRecords.push(catrecord);
     this.arrayRecords.next([...this.userRecords]);
  });
 }
}

