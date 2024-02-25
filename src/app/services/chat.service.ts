import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  private baseUrl = 'https://insta-be.vercel.app/chats';
  // private baseUrl = 'https://insta-be.vercel.app/auth';

  constructor(private http: HttpClient) {}
  sendMessage(data: any) {
    return this.http.post(`${this.baseUrl}/sendMessage`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  getChat(data: any) {
    return this.http.post(`${this.baseUrl}/getChat`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }

}
