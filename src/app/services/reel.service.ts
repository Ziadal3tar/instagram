import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ContentItem, FeedPage } from '../core/models/api.models';

@Injectable({ providedIn: 'root' })
export class ReelService {
  private readonly baseUrl = `${environment.apiUrl}/reels`;

  constructor(private http: HttpClient) {}

  addReel(data: FormData): Observable<ApiResponse<ContentItem>> {
    return this.http.post<ApiResponse<ContentItem>>(`${this.baseUrl}/addReel`, data);
  }

  getAllReels(page = 1, limit = 10): Observable<ApiResponse<{ page: number; limit: number; reels: ContentItem[]; hasMore: boolean }>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<{ page: number; limit: number; reels: ContentItem[]; hasMore: boolean }>>(`${this.baseUrl}/getAllReels`, { params });
  }
}
