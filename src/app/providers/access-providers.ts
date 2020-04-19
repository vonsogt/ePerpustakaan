import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AccessProviders {
    // url backend api json
    // server: string = 'http://localhost/api-ePerpustakaan/';
    server: string = 'http://localhost:8005/';

    constructor(
        public http: HttpClient,
    ) { }

    postData(body: any, file: any) {
        let headers = new HttpHeaders({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token',
            'Content-Type': 'application/json; charset=utf-8',
        });
        let options = {
            headers: headers
        }

        return this.http.post(this.server + file, JSON.stringify(body), options)
            .timeout(59000) // 59 Detik timeout
            .map(res => res);
    }
}