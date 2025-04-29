import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(public http: HttpClient) {}

  registerUser(user: any) {
    return this.http.post('http://35.175.111.200:8080/register', user);
  }
}
