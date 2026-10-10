import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, ContentItem, FeedPage } from '../core/models/api.models';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly baseUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  addPost(data: FormData): Observable<ApiResponse<ContentItem>> {
    return this.http.post<ApiResponse<ContentItem>>(`${this.baseUrl}/addPost`, data);
  }

  getExplorePosts(page = 1, limit = 20): Observable<ApiResponse<FeedPage>> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ApiResponse<FeedPage>>(`${this.baseUrl}/explore`, { params });
  }

  like(id: string, type: 'post' | 'reel'): Observable<ApiResponse<{ liked: boolean; likesCount: number; id: string; type: string }>> {
    return this.http.post<ApiResponse<{ liked: boolean; likesCount: number; id: string; type: string }>>(`${this.baseUrl}/like`, { _id: id, type });
  }

  addComment(id: string, type: 'post' | 'reel', comment: string): Observable<ApiResponse<{ id: string; type: string; comment: any; commentsCount: number }>> {
    return this.http.post<ApiResponse<{ id: string; type: string; comment: any; commentsCount: number }>>(`${this.baseUrl}/addComment`, { _id: id, type, comment });
  }

  getPostById(id: string, type?: 'post' | 'reel', commentPage = 1, commentLimit = 30): Observable<ApiResponse<ContentItem>> {
    return this.http.post<ApiResponse<ContentItem>>(`${this.baseUrl}/getPostById`, { _id: id, ...(type ? { type } : {}), commentPage, commentLimit });
  }
}
