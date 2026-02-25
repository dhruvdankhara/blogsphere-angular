import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog';
import { AuthService } from '../../../core/services/auth';
import { Blog } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BlogCard, ProgressSpinner],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private blogService = inject(BlogService);
  auth = inject(AuthService);

  blogs = signal<Blog[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.blogService.getAll().subscribe({
      next: (res) => {
        this.blogs.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
