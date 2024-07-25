import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReelService {
  private baseUrl = 'https://insta-be-ziadal3tars-projects.vercel.app/reels';
  // private baseUrl = 'https://insta-be-ziadal3tars-projects.vercel.app/posts';
  constructor(private http: HttpClient) {}
  addReel(data: any): any {
    return this.http.post(`${this.baseUrl}/addReel`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  getAllReels(data: any): any {
    return this.http.post(`${this.baseUrl}/getAllReels`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
}
