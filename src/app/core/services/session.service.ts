import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly authenticated$ = this.authenticatedSubject.asObservable();

  get token(): string | null {
    return localStorage.getItem('userToken');
  }

  get userId(): string | null {
    return localStorage.getItem('id');
  }

  hasToken(): boolean {
    return Boolean(this.token);
  }

  setSession(token: string, id: string): void {
    localStorage.setItem('userToken', token);
    localStorage.setItem('id', id);
    this.authenticatedSubject.next(true);
  }

  clear(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('id');
    this.authenticatedSubject.next(false);
  }
}
