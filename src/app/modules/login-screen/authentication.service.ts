import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    constructor(private httpClient: HttpClient) {

    }

    login(username: string, password: string) {
        var url = this.getApiUrl() + "security/login";
        var authHeader = "Basic " + btoa(username + ":" + password);
        var authHttpOptions = {
            headers: new HttpHeaders({ 'Authorization':  authHeader})
        }
        return this.httpClient.get(url, authHttpOptions);
    }

    recover(username: string, email: string) {
        var url = this.getApiUrl() + "security/forgotPassword?";
        if (username) {
            url += "username=" + username;
        } else {
            url += "emailAddress=" + email;
        }
        return this.httpClient.post(url, httpOptions);
    }

    private getApiUrl() {
        var paths = localStorage.getItem("paths");
        if (paths) {
            return JSON.parse(paths).EHUB_API;
        } else {
            console.log('no paths in localStorage');
            throw 'no paths in localStorage';
        }
    }

    getUserInfo(token) {
        var url = this.getApiUrl() + "security/info?token=" + token;
        return this.httpClient.get(url, httpOptions);
    }

}