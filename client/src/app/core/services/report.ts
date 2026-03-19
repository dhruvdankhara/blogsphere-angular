import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Report } from '../models/index';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/report`;

  constructor(private http: HttpClient) {}

  report(
    blogId: string,
    data: { reason: string; description?: string },
  ): Observable<ApiResponse<Report>> {
    return this.http.post<ApiResponse<Report>>(`${this.apiUrl}/${blogId}`, data);
  }

  getAll(status?: string): Observable<ApiResponse<Report[]>> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<ApiResponse<Report[]>>(this.apiUrl, { params });
  }

  updateStatus(reportId: string, status: string): Observable<ApiResponse<Report>> {
    return this.http.patch<ApiResponse<Report>>(`${this.apiUrl}/${reportId}/status`, { status });
  }

  delete(reportId: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${reportId}`);
  }
}
