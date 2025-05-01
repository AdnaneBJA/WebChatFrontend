import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(public http: HttpClient) {}

  registerUser(user: any) {
    return this.http.post('http://35.175.111.200:8080/register', user);
  }

  loginUser(user: any) {
    return this.http.post('http://localhost:8080/login', user, {
      responseType: 'text',
    });
  }

  retrieveUserInfo(user: any) {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post('http://localhost:8080/retriveUserInfo', user, {
      headers,
    });
  }

  retrieveAllUsers() {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`http://localhost:8080/users`, { headers });
  }

  loadProfilePicture(id: string) {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`http://localhost:8080/users/${id}/profile-picture`, {
      headers,
      responseType: 'blob', // for images
    });
  }

  updateProfilePicture(id: any, formData: FormData) {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `http://localhost:8080/users/${id}/profile-picture`,
      formData,
      { headers }
    );
  }
}
