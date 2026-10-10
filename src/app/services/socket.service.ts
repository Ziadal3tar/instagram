import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { SessionService } from '../core/services/session.service';

interface SocketEvent<T = unknown> {
  event: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket?: Socket;
  private connectedToken?: string;
  private readonly eventsSubject = new Subject<SocketEvent>();

  constructor(private readonly session: SessionService) {}

  connect(): void {
    const token = this.session.token;
    if (!token) return;

    if (this.socket?.connected && this.connectedToken === token) return;

    this.disconnect();

    this.connectedToken = token;
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 8000,
    });

    this.socket.onAny((event, data) => {
      this.eventsSubject.next({ event, data });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = undefined;
    this.connectedToken = undefined;
  }

  emit<T = unknown>(event: string, data?: T): void {
    if (!this.socket) this.connect();
    this.socket?.emit(event, data);
  }

  listen<T = unknown>(event: string): Observable<T> {
    return this.eventsSubject.asObservable().pipe(
      filter((entry) => entry.event === event),
      map((entry) => entry.data as T)
    );
  }
}
