import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Blog, BlogDetail, Comment } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blog`;

  constructor(private http: HttpClient) {}

  getAll(params?: { category?: string; tag?: string }): Observable<ApiResponse<Blog[]>> {
    let httpParams = new HttpParams();
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.tag) httpParams = httpParams.set('tag', params.tag);
    return this.http.get<ApiResponse<Blog[]>>(this.apiUrl, { params: httpParams });
  }

  getBySlug(slug: string): Observable<ApiResponse<BlogDetail>> {
    return this.http.get<ApiResponse<BlogDetail>>(`${this.apiUrl}/${slug}`);
  }

  create(data: FormData): Observable<ApiResponse<Blog>> {
    return this.http.post<ApiResponse<Blog>>(this.apiUrl, data);
  }

  update(slug: string, data: FormData): Observable<ApiResponse<Blog>> {
    return this.http.post<ApiResponse<Blog>>(`${this.apiUrl}/${slug}`, data);
  }

  delete(slug: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${slug}`);
  }

  search(query: string): Observable<ApiResponse<Blog[]>> {
    return this.http.get<ApiResponse<Blog[]>>(`${this.apiUrl}/search/${encodeURIComponent(query)}`);
  }

  getMyDrafts(): Observable<ApiResponse<Blog[]>> {
    return this.http.get<ApiResponse<Blog[]>>(`${this.apiUrl}/my-drafts`);
  }

  like(blogId: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/${blogId}/like`, {});
  }

  unlike(blogId: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/${blogId}/unlike`, {});
  }

  getComments(blogId: string): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(`${this.apiUrl}/${blogId}/comment`);
  }

  addComment(blogId: string, content: string): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(`${this.apiUrl}/${blogId}/comment`, { content });
  }

  replyToComment(
    blogId: string,
    commentId: string,
    content: string,
  ): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(
      `${this.apiUrl}/${blogId}/comment/${commentId}/reply`,
      { content },
    );
  }

  getCommentReplies(blogId: string, commentId: string): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(
      `${this.apiUrl}/${blogId}/comment/${commentId}/reply`,
    );
  }

  generateImage(title: string): Observable<ApiResponse<{ imageUrl: string }>> {
    return this.http.post<ApiResponse<{ imageUrl: string }>>(`${this.apiUrl}/generate-image`, {
      title,
    });
  }
}
