import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, UserProfile, UserStats, UserDetailedStats, Blog } from '../models/index';

export interface FollowUser {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getProfile(username: string): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/${username}`);
  }

  getStats(username: string): Observable<ApiResponse<UserStats>> {
    return this.http.get<ApiResponse<UserStats>>(`${this.apiUrl}/${username}/stats`);
  }

  getDetailedStats(username: string): Observable<ApiResponse<UserDetailedStats>> {
    return this.http.get<ApiResponse<UserDetailedStats>>(
      `${this.apiUrl}/${username}/detailed-stats`,
    );
  }

  getUserPosts(username: string): Observable<ApiResponse<Blog[]>> {
    return this.http.get<ApiResponse<Blog[]>>(`${this.apiUrl}/${username}/blogs`);
  }

  follow(username: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${username}/follow`, {});
  }

  unfollow(username: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${username}/unfollow`, {});
  }

  getFollowers(username: string): Observable<ApiResponse<FollowUser[]>> {
    return this.http.get<ApiResponse<FollowUser[]>>(`${this.apiUrl}/${username}/followers`);
  }

  getFollowing(username: string): Observable<ApiResponse<FollowUser[]>> {
    return this.http.get<ApiResponse<FollowUser[]>>(`${this.apiUrl}/${username}/following`);
  }
}
