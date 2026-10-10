import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ChatMessage, ChatSummary, UserSummary } from '../core/models/api.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly baseUrl = `${environment.apiUrl}/chats`;

  constructor(private http: HttpClient) {}

  sendMessage(to: string, message: string, time?: string): Observable<ApiResponse<{ chatId: string; message: ChatMessage }>> {
    return this.http.post<ApiResponse<{ chatId: string; message: ChatMessage }>>(`${this.baseUrl}/sendMessage`, { to, message, time });
  }
getChat(
  to: string,
  limit = 50
): Observable<
  ApiResponse<{
    user: UserSummary;
    chat: ChatSummary | null;
    limit: number;
  }>
> {
  const params = new HttpParams().set('limit', limit);

  return this.http.post<
    ApiResponse<{
      user: UserSummary;
      chat: ChatSummary | null;
      limit: number;
    }>
  >(
    `${this.baseUrl}/getChat`,
    { to },
    { params }
  );
}
}
