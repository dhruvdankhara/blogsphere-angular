import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookmarkService } from '../../../core/services/bookmark';
import { Bookmark } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [RouterLink, BlogCard, Button, ProgressSpinner],
  templateUrl: './bookmarks.html',
  styleUrl: './bookmarks.css',
})
export class Bookmarks implements OnInit {
  private bookmarkService = inject(BookmarkService);
  private confirmService = inject(ConfirmationService);
  private message = inject(MessageService);

  bookmarks = signal<Bookmark[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadBookmarks();
  }

  loadBookmarks() {
    this.loading.set(true);
    this.bookmarkService.getAll().subscribe({
      next: (res) => {
        this.bookmarks.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  removeBookmark(blogId: string) {
    this.confirmService.confirm({
      message: 'Are you sure you want to remove this bookmark?',
      header: 'Remove Bookmark',
      icon: 'pi pi-bookmark',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.bookmarkService.remove(blogId).subscribe({
          next: () => {
            this.bookmarks.update((list) => list.filter((b) => b.blogId !== blogId));
            this.message.add({
              severity: 'success',
              summary: 'Removed',
              detail: 'Bookmark removed',
            });
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to remove bookmark',
            });
          },
        });
      },
    });
  }
}
