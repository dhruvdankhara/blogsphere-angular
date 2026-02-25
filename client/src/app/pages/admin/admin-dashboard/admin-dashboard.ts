import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { DashboardStats } from '../../../core/models/index';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [ProgressSpinner],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);

  statCards = signal<{ label: string; value: number; icon: string; color: string }[]>([]);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.statCards.set([
          {
            label: 'Total Users',
            value: res.data.totalUsers,
            icon: 'pi pi-users',
            color: 'text-blue-600 bg-blue-50',
          },
          {
            label: 'Total Blogs',
            value: res.data.totalBlogs,
            icon: 'pi pi-book',
            color: 'text-purple-600 bg-purple-50',
          },
          {
            label: 'Published',
            value: res.data.publishedBlogs,
            icon: 'pi pi-check-circle',
            color: 'text-green-600 bg-green-50',
          },
          {
            label: 'Drafts',
            value: res.data.draftBlogs,
            icon: 'pi pi-file-edit',
            color: 'text-orange-600 bg-orange-50',
          },
          {
            label: 'Total Comments',
            value: res.data.totalComments,
            icon: 'pi pi-comments',
            color: 'text-cyan-600 bg-cyan-50',
          },
          {
            label: 'Total Likes',
            value: res.data.totalLikes,
            icon: 'pi pi-heart',
            color: 'text-red-600 bg-red-50',
          },
          {
            label: 'Total Reports',
            value: res.data.totalReports,
            icon: 'pi pi-flag',
            color: 'text-yellow-600 bg-yellow-50',
          },
          {
            label: 'Pending Reports',
            value: res.data.pendingReports,
            icon: 'pi pi-exclamation-circle',
            color: 'text-rose-600 bg-rose-50',
          },
        ]);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
