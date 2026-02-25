import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../core/services/blog';
import { Blog } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-category-page',
  imports: [BlogCard, ProgressSpinner],
  templateUrl: './category-page.html',
  styleUrl: './category-page.css',
})
export class CategoryPage implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  slug = signal('');
  blogs = signal<Blog[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.slug.set(params['slug']);
      this.loadBlogs();
    });
  }

  private loadBlogs() {
    this.loading.set(true);
    this.blogService.getAll({ category: this.slug() }).subscribe({
      next: (res) => {
        this.blogs.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
