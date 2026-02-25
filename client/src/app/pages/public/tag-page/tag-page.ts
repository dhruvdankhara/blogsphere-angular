import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../core/services/blog';
import { TagService } from '../../../core/services/tag';
import { Blog, Tag } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { TagChip } from '../../../shared/components/tag-chip/tag-chip';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-tag-page',
  imports: [BlogCard, TagChip, ProgressSpinner],
  templateUrl: './tag-page.html',
  styleUrl: './tag-page.css',
})
export class TagPage implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private tagService = inject(TagService);

  slug = signal('');
  blogs = signal<Blog[]>([]);
  relatedTags = signal<Tag[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.slug.set(params['slug']);
      this.loadBlogs();
      this.loadRelatedTags();
    });
  }

  private loadBlogs() {
    this.loading.set(true);
    this.blogService.getAll({ tag: this.slug() }).subscribe({
      next: (res) => {
        this.blogs.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private loadRelatedTags() {
    this.tagService.getAll().subscribe({
      next: (res) => {
        const all = res.data || [];
        this.relatedTags.set(all.filter((t: Tag) => t.slug !== this.slug()).slice(0, 10));
      },
    });
  }
}
