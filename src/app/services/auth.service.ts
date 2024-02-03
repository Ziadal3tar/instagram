import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private baseUrl = 'http://localhost:3000/auth';
  private baseUrl = 'https://insta-be.vercel.app/auth';

  constructor(private http: HttpClient) {}
  register(data: any): any {
    return this.http.post(`${this.baseUrl}/signUp`, data, {});
  }
  logIn(data: any): any {
    return this.http.post(`${this.baseUrl}/logIn`, data, {});
  }
  loginWithGoogle(data: any): any {
    return this.http.post(`${this.baseUrl}/logInWithGoogle`, data, {});
  }
  loginWithFB(data: any): any {
    return this.http.post(`${this.baseUrl}/loginWithFB`, data, {});
  }
  logInWithFbOrGoogle(data: any): any {
    return this.http.post(`${this.baseUrl}/logInWithFbOrGoogle`, data, {});
  }
}
