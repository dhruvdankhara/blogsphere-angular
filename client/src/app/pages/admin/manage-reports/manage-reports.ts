import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReportService } from '../../../core/services/report';
import { AdminService } from '../../../core/services/admin';
import { Report } from '../../../core/models/index';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-manage-reports',
  standalone: true,
  imports: [DatePipe, TableModule, Button, Select, Tag, ProgressSpinner, FormsModule, Tooltip],
  templateUrl: './manage-reports.html',
  styleUrl: './manage-reports.css',
})
export class ManageReports implements OnInit {
  private reportService = inject(ReportService);
  private adminService = inject(AdminService);
  private confirmService = inject(ConfirmationService);
  private message = inject(MessageService);

  reports = signal<Report[]>([]);
  loading = signal(true);
  selectedStatus = signal('');

  statusOptions = [
    { label: 'All Statuses', value: '' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Reviewed', value: 'REVIEWED' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Dismissed', value: 'DISMISSED' },
  ];

  statusUpdateOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Reviewed', value: 'REVIEWED' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Dismissed', value: 'DISMISSED' },
  ];

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading.set(true);
    const status = this.selectedStatus();
    this.reportService.getAll(status || undefined).subscribe({
      next: (res) => {
        this.reports.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterChange() {
    this.loadReports();
  }

  getStatusSeverity(
    status: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'PENDING':
        return 'warn';
      case 'REVIEWED':
        return 'info';
      case 'RESOLVED':
        return 'success';
      case 'DISMISSED':
        return 'secondary';
      default:
        return 'info';
    }
  }

  onStatusChange(reportId: string, status: string) {
    this.reportService.updateStatus(reportId, status).subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report status updated',
        });
      },
      error: (err) => {
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to update status',
        });
        this.loadReports();
      },
    });
  }

  deleteReport(report: Report) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete this report?',
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.reportService.delete(report._id).subscribe({
          next: () => {
            this.message.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Report deleted successfully',
            });
            this.loadReports();
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete report',
            });
          },
        });
      },
    });
  }

  removeBlog(report: Report) {
    if (!report.blog?.slug) return;
    this.confirmService.confirm({
      message: `Remove "${report.blog.title}"? This will permanently delete the blog post and dismiss all reports against it.`,
      header: 'Remove Blog Post',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, Remove Blog',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.deleteBlog(report.blog!.slug!).subscribe({
          next: () => {
            this.message.add({
              severity: 'success',
              summary: 'Blog Removed',
              detail: 'Blog post has been permanently removed.',
            });
            this.loadReports();
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to remove blog post',
            });
          },
        });
      },
    });
  }
}
