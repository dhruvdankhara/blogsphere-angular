import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Tag } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/tags`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<Tag[]>> {
    return this.http.get<ApiResponse<Tag[]>>(this.apiUrl);
  }

  getById(id: string): Observable<ApiResponse<Tag>> {
    return this.http.get<ApiResponse<Tag>>(`${this.apiUrl}/${id}`);
  }

  create(data: { name: string; slug: string }): Observable<ApiResponse<Tag>> {
    return this.http.post<ApiResponse<Tag>>(this.apiUrl, data);
  }

  update(id: string, data: { name?: string; slug?: string }): Observable<ApiResponse<Tag>> {
    return this.http.patch<ApiResponse<Tag>>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
