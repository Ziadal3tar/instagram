import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private baseUrl = 'https://insta-eoq9k26ys-ziadal3tars-projects.vercel.app/posts';
  // private baseUrl = 'https://insta-eoq9k26ys-ziadal3tars-projects.vercel.app/posts';

  constructor(private http: HttpClient) {}
  addPost(data: any): any {
    return this.http.post(`${this.baseUrl}/addPost`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  like(data: any) {
    return this.http.post(`${this.baseUrl}/like`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  addComment(data: any) {
    return this.http.post(`${this.baseUrl}/addComment`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  getPostById(_id: any) {
    let data={_id}
    return this.http.post(`${this.baseUrl}/getPostById`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
}
