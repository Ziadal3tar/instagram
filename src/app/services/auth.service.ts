import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular'
import { Observable } from 'rxjs';
import { signUp,signIn } from '../graphQl/mutations';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://instagram-apis-s4le.onrender.com/auth';
  // private baseUrl = 'https://instagram-apis-s4le.onrender.com/auth'
// https://insta-be-ziadal3tars-projects.vercel.app
  constructor(private http: HttpClient,private apollo: Apollo) {}
  register(data: any): any {
    return this.http.post(`${this.baseUrl}/signUp`, data, {});

  }
  logIn(data: any):any {
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
