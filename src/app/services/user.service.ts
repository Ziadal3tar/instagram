import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private baseUrl = 'https://insta-eoq9k26ys-ziadal3tars-projects.vercel.app/user';
  private baseUrl = 'https://insta-eoq9k26ys-ziadal3tars-projects.vercel.app/user';

  constructor(private http: HttpClient) {}
  getUserData(data: any): any {
    return this.http.post(`${this.baseUrl}/getUserData`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  changeUserImage(data: any): any {
    return this.http.post(`${this.baseUrl}/changeUserImage`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  searchUser(data: any): any {
    return this.http.post(`${this.baseUrl}/searchUser`, data, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  getProfilesData(data: any): any {
    return this.http.post(`${this.baseUrl}/getProfilesData`, data);
  }
  visited(_id: any): any {
    return this.http.get(`${this.baseUrl}/visited/${_id}`, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  follow(_id: any): any {
    return this.http.get(`${this.baseUrl}/follow/${_id}`, {
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  newCollection(data: any): any {
    return this.http.post(`${this.baseUrl}/newCollection`,data ,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  savePost(data: any): any {
    return this.http.post(`${this.baseUrl}/savePost`,data ,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  addToCollection(data: any): any {
    return this.http.post(`${this.baseUrl}/addToCollection`,data ,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  getPostsBasedOnSocialNetwork() {

    return this.http.get(`${this.baseUrl}/getPosts` ,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  allNotificationSeen() {

    return this.http.get(`${this.baseUrl}/allNotificationSeen` ,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  getSaved() {

    return this.http.get(`${this.baseUrl}/getSaved` ,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
  bio(data:any) {

    return this.http.post(`${this.baseUrl}/bio` ,data,{
      headers: {
        authorization: `Bearer__${localStorage.getItem('userToken')}`,
      },
    });
  }
}
