import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoriesService {

  private baseUrl = 'https://insta-be-ziadal3tars-projects.vercel.app/stories';
  // private baseUrl = 'https://insta-be-ziadal3tars-projects.vercel.app/stories';

  constructor(private http: HttpClient) {}
  addStory(data: any): any {
    return this.http.post(`${this.baseUrl}/addStory`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
}
