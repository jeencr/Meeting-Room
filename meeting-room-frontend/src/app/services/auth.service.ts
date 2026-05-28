import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  logout() {
    localStorage.removeItem('token');
  }
}
