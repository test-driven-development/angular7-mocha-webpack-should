import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class RestfulConnectorsService {
  constructor(private http: HttpClient) {}

  requests(): Promise<any> {
    const url = `${environment.api}/dpo/requests`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, {headers}).toPromise();
  }

  requestDetails(requestId: string): Promise<any> {
    const url = `${environment.api}/dpo/requests/${requestId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, {headers}).toPromise<any>();
  }

  fetch(type): Promise<any> {
    const url = `${environment.api}/dpo/requests`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const params = new HttpParams().set('type', type);
    return this.http.get(url, {headers, params}).toPromise();
  }

  post(requestId: string, event: any): Promise<any> {
    const url = `${environment.api}/dpo/requests/${requestId}/event`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, event, {headers}).toPromise<any>();
  }

  patch(requestId: string, payload: any): Promise<any> {
    const url = `${environment.api}/dpo/requests/${requestId}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.patch(url, payload, {headers}).toPromise<any>();
  }

  download(docId): Promise<any> {
    const url = `${environment.api}/files/${docId}`;
    return this.http.get(url, {responseType: 'blob'}).toPromise<any>();
  }

  upload(requestId, formData: any): Promise<any> {
    const url = `${environment.api}/dpo/requests/${requestId}/document`;
    return this.http.post(url, formData).toPromise<any>();
  }

  fetchSecurityRestrictions(requestId): Promise<any> {
    const url = `${environment.api}/dpo/requests/${requestId}/security-restrictions`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(url, {headers}).toPromise<any>();
  }
}
