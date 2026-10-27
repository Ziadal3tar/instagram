import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/api.models';
import { SessionService } from '../core/services/session.service';

interface AuthData {
  id: string;
  token: string;
  user?: any;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private session: SessionService) {}

  register(data: unknown): Observable<ApiResponse<{ id: string; user: any }>> {
    return this.http.post<ApiResponse<{ id: string; user: any }>>(`${this.baseUrl}/signUp`, data);
  }

  logIn(data: unknown): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.baseUrl}/logIn`, data).pipe(tap((response) => this.persist(response)));
  }

  loginWithGoogle(data: unknown): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.baseUrl}/loginWithGoogle`, data).pipe(tap((response) => this.persist(response)));
  }

  loginWithFB(data: unknown): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.baseUrl}/loginWithFB`, data).pipe(tap((response) => this.persist(response)));
  }

  logInWithFbOrGoogle(data: unknown): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(`${this.baseUrl}/logInWithFbOrGoogle`, data).pipe(tap((response) => this.persist(response)));
  }

  logout(): void {
    this.session.clear();
  }

  private persist(response: ApiResponse<AuthData>): void {
    const data = response.data;
    if (response.success && data?.token && data.id) {
      this.session.setSession(data.token, data.id);
    }
  }
}
