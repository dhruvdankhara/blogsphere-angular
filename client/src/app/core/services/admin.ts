import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User, Blog, DashboardStats } from '../models/index';

interface AdminUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

interface AdminBlogsResponse {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard`);
  }

  getUsers(params?: {
    search?: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<AdminUsersResponse>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.role) httpParams = httpParams.set('role', params.role);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    return this.http.get<ApiResponse<AdminUsersResponse>>(`${this.apiUrl}/users`, {
      params: httpParams,
    });
  }

  getUserById(
    userId: string,
  ): Observable<ApiResponse<User & { followers: number; following: number; posts: number }>> {
    return this.http.get<
      ApiResponse<User & { followers: number; following: number; posts: number }>
    >(`${this.apiUrl}/users/${userId}`);
  }

  updateUserRole(userId: string, role: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  deleteUser(userId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/users/${userId}`);
  }

  getBlogs(params?: {
    search?: string;
    isDraft?: string;
    isPublic?: string;
    page?: number;
    limit?: number;
  }): Observable<ApiResponse<AdminBlogsResponse>> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.isDraft) httpParams = httpParams.set('isDraft', params.isDraft);
    if (params?.isPublic) httpParams = httpParams.set('isPublic', params.isPublic);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    return this.http.get<ApiResponse<AdminBlogsResponse>>(`${this.apiUrl}/blogs`, {
      params: httpParams,
    });
  }

  deleteBlog(slug: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/blogs/${slug}`);
  }
}
