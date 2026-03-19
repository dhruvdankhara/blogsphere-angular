import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUser = signal<User | null>(null);

  user = this.currentUser.asReadonly();
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/auth/register`, data);
  }

  login(data: {
    username?: string;
    email?: string;
    password: string;
  }): Observable<ApiResponse<{ user: User; token: string }>> {
    return this.http
      .post<ApiResponse<{ user: User; token: string }>>(`${this.apiUrl}/auth/login`, data)
      .pipe(
        tap((res) => {
          if (res.data?.user) {
            this.currentUser.set(res.data.user);
          }
        }),
      );
  }

  logout(): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.router.navigate(['/']);
      }),
    );
  }

  getMe(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/auth/me`).pipe(
      tap((res) => {
        if (res.data) {
          this.currentUser.set(res.data);
        }
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of({
          success: false,
          statusCode: 401,
          message: 'Not authenticated',
          data: null as unknown as User,
        });
      }),
    );
  }

  changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/auth/change-password`, data);
  }

  updateAvatar(file: File): Observable<ApiResponse<User>> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/auth/update-avatar`, formData).pipe(
      tap((res) => {
        if (res.data) {
          this.currentUser.set(res.data);
        }
      }),
    );
  }

  updateUser(data: {
    name?: string;
    username?: string;
    email?: string;
    gender?: string;
    bio?: string;
  }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/auth/update-user`, data).pipe(
      tap((res) => {
        if (res.data) {
          this.currentUser.set(res.data);
        }
      }),
    );
  }

  setUser(user: User | null) {
    this.currentUser.set(user);
  }
}
