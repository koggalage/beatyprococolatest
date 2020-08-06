import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseDataService {

  baseUrl: string;
  private token: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.api;
  }

  makeGetCall(path: string): Observable<any> {
    let headers = new HttpHeaders({ 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'bearer ' + this.getToken() });
    return this.http.get(this.constructUrl(path), { headers: headers })
  }

  makeGetCallTemp(path: string): Observable<any> {
    let headers = new HttpHeaders({ 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'bearer ' + this.getToken() });
    return this.http.get(path, { headers: headers })
  }

  makePostCall(path: string, body: any): Observable<any> {
    let bodyJson = JSON.stringify(body);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'bearer ' + this.getToken() });
    return this.http.post(this.constructUrl(path), bodyJson, { headers: headers })
  }

  makeDeleteCall(path: string): Observable<any> {
    let headers = new HttpHeaders({ 'X-Requested-With': 'XMLHttpRequest', 'Authorization': 'bearer ' + this.getToken() });
    return this.http.delete(this.constructUrl(path), { headers: headers });
  }

  private getToken() {
    return localStorage.getItem('token');
  }

  private constructUrl(path: string) {
    return this.baseUrl + path;
  }
}
