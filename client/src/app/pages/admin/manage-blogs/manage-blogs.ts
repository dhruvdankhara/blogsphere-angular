import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { Blog } from '../../../core/models/index';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-blogs',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    TableModule,
    Button,
    InputText,
    Tag,
    ProgressSpinner,
    FormsModule,
  ],
  templateUrl: './manage-blogs.html',
  styleUrl: './manage-blogs.css',
})
export class ManageBlogs implements OnInit {
  private adminService = inject(AdminService);
  private confirmService = inject(ConfirmationService);
  private message = inject(MessageService);

  blogs = signal<Blog[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  totalRecords = signal(0);

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.loading.set(true);
    const params: { search?: string; page?: number; limit?: number } = { limit: 50 };
    const search = this.searchQuery();
    if (search) {
      params.search = search;
    }
    this.adminService.getBlogs(params).subscribe({
      next: (res) => {
        this.blogs.set(res.data.blogs);
        this.totalRecords.set(res.data.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch() {
    this.loadBlogs();
  }

  deleteBlog(blog: Blog) {
    this.confirmService.confirm({
      message: `Are you sure you want to delete "${blog.title}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.deleteBlog(blog.slug).subscribe({
          next: () => {
            this.message.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Blog deleted successfully',
            });
            this.loadBlogs();
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete blog',
            });
          },
        });
      },
    });
  }
}
