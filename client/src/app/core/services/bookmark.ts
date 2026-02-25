import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Bookmark } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  private apiUrl = `${environment.apiUrl}/bookmark`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Bookmark[]>> {
    return this.http.get<ApiResponse<Bookmark[]>>(this.apiUrl);
  }

  add(blogId: string): Observable<ApiResponse<Bookmark>> {
    return this.http.post<ApiResponse<Bookmark>>(`${this.apiUrl}/${blogId}`, {});
  }

  remove(blogId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${blogId}`);
  }

  getStatus(blogId: string): Observable<ApiResponse<{ isBookmarked: boolean }>> {
    return this.http.get<ApiResponse<{ isBookmarked: boolean }>>(`${this.apiUrl}/${blogId}/status`);
  }
}
