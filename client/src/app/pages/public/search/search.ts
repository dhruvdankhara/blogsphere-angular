import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog';
import { Blog } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { ProgressSpinner } from 'primeng/progressspinner';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-search',
  imports: [FormsModule, BlogCard, ProgressSpinner, InputText, Button],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);

  query = signal('');
  results = signal<Blog[]>([]);
  loading = signal(false);
  searched = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['q']) {
        this.query.set(params['q']);
        this.performSearch();
      }
    });
  }

  performSearch() {
    const q = this.query().trim();
    if (!q) return;
    this.loading.set(true);
    this.searched.set(true);
    this.blogService.search(q).subscribe({
      next: (res) => {
        this.results.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
