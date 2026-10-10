import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/api.models';

@Injectable({ providedIn: 'root' })
export class StoriesService {
  private readonly baseUrl = `${environment.apiUrl}/stories`;

  constructor(private http: HttpClient) {}

  addStory(data: FormData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/addStory`, data);
  }
}
