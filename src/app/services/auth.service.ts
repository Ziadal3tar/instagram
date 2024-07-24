import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular'
import { Observable } from 'rxjs';
import { signUp,signIn } from '../graphQl/mutations';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://insta-eoq9k26ys-ziadal3tars-projects.vercel.app/auth';
  // private baseUrl = 'http://localhost:3000;

  constructor(private http: HttpClient,private apollo: Apollo) {}
  register(data: any): any {
    return this.http.post(`${this.baseUrl}/signUp`, data, {});
    // return this.apollo.mutate({
    //   mutation: signUp,
    //   variables: data,
    // });
  }
  logIn(data: any):any {
    return this.http.post(`${this.baseUrl}/logIn`, data, {});

    // return this.apollo.mutate({
    //   mutation: signIn,
    //   variables: data,
    // });
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
