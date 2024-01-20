import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://insta-be.vercel.app/user';
  // private baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}
  getUserData(data:any): any {
    return this.http.post(`${this.baseUrl}/getUserData`,data,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  changeUserImage(data:any): any {
    return this.http.post(`${this.baseUrl}/changeUserImage`,data,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
}
