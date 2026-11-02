
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

    if (!token) {
      console.warn('Socket: No authentication token found');
      return;
    }

    if (this.socket?.connected && this.connectedToken === token) {
      return;
    }

    this.disconnect();

    this.connectedToken = token;

    this.socket = io(environment.socketUrl, {
      transports: ['polling', 'websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 8000,
      withCredentials: true,
    });

    // Successful connection
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);

      // Register the user's socket ID in Backend
      this.socket?.emit('updateSocketId', token);
    });

    // Connection errors
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // Disconnection
    this.socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });

    // Reconnection
    this.socket.io.on('reconnect', (attempt) => {
      console.log('Socket reconnected after attempts:', attempt);
    });

    // Listen to all incoming events
    this.socket.onAny((event, data) => {
      this.eventsSubject.next({ event, data });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.io.removeAllListeners();
      this.socket.disconnect();
    }

    this.socket = undefined;
    this.connectedToken = undefined;
  }

  emit<T = unknown>(event: string, data?: T): void {
    if (!this.socket) {
      this.connect();
    }

    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  listen<T = unknown>(event: string): Observable<T> {
    return this.eventsSubject.asObservable().pipe(
      filter((entry) => entry.event === event),
      map((entry) => entry.data as T)
    );
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}
