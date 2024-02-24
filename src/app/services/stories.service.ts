import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  private baseUrl = 'http://localhost:3000/stories';
  // private baseUrl = 'http://localhost:3000/stories';

  constructor(private http: HttpClient) {}
  addStory(data: any): any {
    return this.http.post(`${this.baseUrl}/addStory`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
}
