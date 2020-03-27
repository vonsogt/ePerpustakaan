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
            'Content-Type': 'application/json',
        });
        let options = {
            headers: headers
        }

        return this.http.post(this.server + file, JSON.stringify(body), options)
            .timeout(59000) // 59 Detik timeout
            .map(res => res);
    }
}