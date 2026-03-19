import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BlogService } from '../../../core/services/blog';
import { UserService } from '../../../core/services/user';
import { AuthService } from '../../../core/services/auth';
import { Blog } from '../../../core/models/index';
import { Button } from 'primeng/button';
import { TabPanel, Tabs, Tab, TabList, TabPanels } from 'primeng/tabs';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-blogs',
  standalone: true,
  imports: [RouterLink, DatePipe, Button, Tabs, Tab, TabList, TabPanels, TabPanel, ProgressSpinner],
  templateUrl: './my-blogs.html',
  styleUrl: './my-blogs.css',
})
export class MyBlogs implements OnInit {
  private blogService = inject(BlogService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private confirmService = inject(ConfirmationService);
  private message = inject(MessageService);

  published = signal<Blog[]>([]);
  drafts = signal<Blog[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading.set(true);
    const username = this.auth.user()?.username;
    if (!username) return;

    this.userService.getUserPosts(username).subscribe({
      next: (res) => {
        this.published.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.blogService.getMyDrafts().subscribe({
      next: (res) => this.drafts.set(res.data || []),
    });
  }

  deleteBlog(slug: string) {
    this.confirmService.confirm({
      message: 'Are you sure you want to delete this blog post?',
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.blogService.delete(slug).subscribe({
          next: () => {
            this.message.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Blog post deleted',
            });
            this.loadPosts();
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete',
            });
          },
        });
      },
    });
  }
}
