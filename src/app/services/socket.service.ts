import { io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private baseUrl = 'http://localhost:3000';
  // private baseUrl = 'http://localhost:3000';
  socket:any 

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
