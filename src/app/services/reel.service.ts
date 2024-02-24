import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReelService {
  private baseUrl = 'http://localhost:3000/reels';
  // private baseUrl = 'http://localhost:3000/posts';
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
