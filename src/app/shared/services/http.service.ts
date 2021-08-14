import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor (private http: HttpClient, private userService: UserService) { }

    createAuthorizationHeader () {

        let token = this.userService.getUserToken();

        if (!token || token === '' || token === undefined) {
            token = '';
        }
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('authorization', token);
        return headers;
    }

    get (url: string) {
        const data: any = {};
        const headers: any = this.createAuthorizationHeader();
        return this.http.post(url, data, {
            headers
        });
    }

    post (url: string, data: any, params?: any) {
        const headers: any = this.createAuthorizationHeader();
        return this.http.post(url, data, {
            headers
        });
    }
}
