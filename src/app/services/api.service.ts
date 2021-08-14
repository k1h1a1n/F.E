import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { GlobalVariablesService } from './global-variables.service';

@Injectable()
export class ApiService {
    apiUrl: string = environment.apiUrl;
    token: string;
    userId: string;
    userIdLcl: string;
    header: HttpHeaders;
    constructor (private auth: AuthService,
                 private http: HttpClient,
                 private globalVariablesProvider: GlobalVariablesService
                 ) {
        // this.token = this.auth.getTokenTemp();
        this.auth.currentUser.subscribe((user) => {
           this.userId = user._id;
        //    this.userId = localStorage.getItem("userid");
           this.token = user.token;
           this.header = new HttpHeaders({
            'content-type': 'application/json',
            Authorization: this.token,
        });
        });
    }

    get (options: { name: string, qs?: string }, type?: string): Observable<any> {

        let {
            // tslint:disable-next-line: prefer-const
            name,
            qs
        } = options;
        if (!qs) {
            qs = '';
        }
console.log(`${this.apiUrl}/${name}?user_id=${this.userId}${qs}`)
        return this.http.get(`${this.apiUrl}/${name}?user_id=${this.userId}${qs}`, {headers: this.header});
    }

    put (name: string, data: any): Observable<any> {

        return this.http.put(`${this.apiUrl}/${name}?user_id=${this.userId}`, data, {headers: this.header});
    }

    post (name: string, data: any ): Observable<any> {
        console.log(`${this.apiUrl}/${name}?user_id=${this.userId}`)
        return this.http.post(`${this.apiUrl}/${name}?user_id=${this.userId}`, data, {headers: this.header});
     
    }

    delete (name: string): Observable<any> {
        console.log(this.header);

        return this.http.delete(`${this.apiUrl}/${name}?user_id=${this.userId}.json`, {headers: this.header});
    }
    profilePicUpload ( imageId: any): Observable<any> {
        console.log(this.header);
        return this.http.post(`${this.apiUrl}/user/uploadPic?user_id=${this.userId}`, imageId, {headers: this.header})
    }

}
