import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog';
import { TagService } from '../../../core/services/tag';
import { Blog, Tag } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { TagChip } from '../../../shared/components/tag-chip/tag-chip';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BlogCard, TagChip, ProgressSpinner],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private blogService = inject(BlogService);
  private tagService = inject(TagService);

  blogs = signal<Blog[]>([]);
  trendingBlogs = signal<Blog[]>([]);
  tags = signal<Tag[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.blogService.getAll().subscribe({
      next: (res) => {
        this.blogs.set(res.data || []);
        const sorted = [...(res.data || [])].sort((a, b) => b.visits - a.visits);
        this.trendingBlogs.set(sorted.slice(0, 6));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.tagService.getAll().subscribe({
      next: (res) => this.tags.set((res.data || []).slice(0, 12)),
    });
  }
}
