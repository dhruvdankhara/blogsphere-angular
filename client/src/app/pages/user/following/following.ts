import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog';
import { Blog } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-following',
  standalone: true,
  imports: [RouterLink, BlogCard, ProgressSpinner, Button],
  templateUrl: './following.html',
  styleUrl: './following.css',
})
export class Following implements OnInit {
  private blogService = inject(BlogService);

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
