import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private baseUrl = 'https://insta-be.vercel.app';
  // private baseUrl = 'https://insta-be.vercel.app';
  socket:any =  io(this.baseUrl)

  constructor(private http: HttpClient) {}


  listen(eventName:any){
    return new Observable((Subscriber)=>{
      this.socket.on(eventName,(data:any)=>{
        Subscriber.next(data)
      })

    })
  }



 emit(eventName:any,data:any){
    this.socket.emit(eventName,data)
  }
}
