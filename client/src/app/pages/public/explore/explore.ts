import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog';
import { CategoryService } from '../../../core/services/category';
import { TagService } from '../../../core/services/tag';
import { Blog, Category, Tag } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { TagChip } from '../../../shared/components/tag-chip/tag-chip';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-explore',
  imports: [RouterLink, BlogCard, TagChip, ProgressSpinner],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore implements OnInit {
  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);

  tags = signal<Tag[]>([]);
  categories = signal<Category[]>([]);
  blogs = signal<Blog[]>([]);
  loading = signal(true);

  topTags = computed(() => this.tags().slice(0, 12));
  spotlightCategories = computed(() => this.categories().slice(0, 6));
  featuredStories = computed(() => this.blogs().slice(0, 3));

  ngOnInit() {
    this.tagService.getAll().subscribe({
      next: (res) => this.tags.set(res.data || []),
    });

    this.categoryService.getAll().subscribe({
      next: (res) => this.categories.set(res.data || []),
    });

    this.blogService.getAll().subscribe({
      next: (res) => {
        this.blogs.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
