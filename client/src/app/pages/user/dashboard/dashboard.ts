import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog';
import { TagService } from '../../../core/services/tag';
import { AuthService } from '../../../core/services/auth';
import { Blog, Tag } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TabPanel, Tabs, Tab, TabList, TabPanels } from 'primeng/tabs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, BlogCard, ProgressSpinner, Tabs, Tab, TabList, TabPanels, TabPanel],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private blogService = inject(BlogService);
  private tagService = inject(TagService);
  auth = inject(AuthService);

  blogs = signal<Blog[]>([]);
  featuredBlogs = signal<Blog[]>([]);
  staffPicks = signal<Blog[]>([]);
  tags = signal<Tag[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.blogService.getAll().subscribe({
      next: (res) => {
        const allBlogs = res.data || [];
        this.blogs.set(allBlogs);
        const sorted = [...allBlogs].sort((a, b) => b.visits - a.visits);
        this.featuredBlogs.set(sorted);
        this.staffPicks.set(sorted.slice(0, 5));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.tagService.getAll().subscribe({
      next: (res) => this.tags.set((res.data || []).slice(0, 8)),
    });
  }
}
