import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'https://meeting-room-15d5.onrender.com/api';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

logout() {

  localStorage.clear()
}
}
