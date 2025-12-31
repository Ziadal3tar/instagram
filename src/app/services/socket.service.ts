import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private baseUrl = 'https://instagram-apis-s4le.onrender.com';
  // private baseUrl = 'https://instagram-apis-s4le.onrender.com';
  socket!: Socket;

  constructor(private http: HttpClient) {}


  listen(eventName:any){
    return new Observable((Subscriber)=>{
      this.socket.on(eventName,(data:any)=>{
        Subscriber.next(data)
      })

    })
  }

 connect(usertoken: any): void {
   this.socket = io('https://instagram-apis-s4le.onrender.com', {
  transports: ['websocket', 'polling'],
});
    this.socket.emit('updateSocketId', usertoken);
  }

 emit(eventName:any,data:any){
    this.socket.emit(eventName,data)
  }
}
