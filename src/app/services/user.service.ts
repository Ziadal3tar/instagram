import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private baseUrl = 'https://instagram-apis-s4le.onrender.com/user';
  private baseUrl = 'https://instagram-apis-s4le.onrender.com/user';

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
addToCollection(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/addToCollection`, data, {
    headers: {
      authorization: `Bearer__${localStorage.getItem('userToken')}`,
    },
  });
}

  getPostsBasedOnSocialNetwork(page:any,limit:any) {

    return this.http.get(`${this.baseUrl}/getPosts?page=${page}&limit=${limit}` ,{
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

  deleteCollection(id: any): Observable<any> {
  return this.http.delete(`${this.baseUrl}/deleteCollection/${id}`, {
    headers: {
      authorization: `Bearer__${localStorage.getItem('userToken')}`,
    },
  });
}
}
