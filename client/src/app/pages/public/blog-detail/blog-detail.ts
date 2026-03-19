import { Component, computed, inject, OnInit, signal, ElementRef, effect } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { BlogService } from '../../../core/services/blog';
import { BookmarkService } from '../../../core/services/bookmark';
import { AuthService } from '../../../core/services/auth';
import { ApiResponse, BlogDetail as BlogDetailModel, Comment } from '../../../core/models/index';
import { TagChip } from '../../../shared/components/tag-chip/tag-chip';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Textarea } from 'primeng/textarea';
import { Divider } from 'primeng/divider';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { ReportService } from '../../../core/services/report';
import { DomSanitizer } from '@angular/platform-browser';
import hljs from 'highlight.js';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    TagChip,
    Avatar,
    Button,
    Textarea,
    Divider,
    ProgressSpinner,
    Dialog,
    Select,
  ],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private bookmarkService = inject(BookmarkService);
  private reportService = inject(ReportService);
  auth = inject(AuthService);
  private message = inject(MessageService);
  private sanitizer = inject(DomSanitizer);
  private el = inject(ElementRef);

  blog = signal<BlogDetailModel | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  newComment = '';
  replyContent: { [key: string]: string } = {};
  showReplies: { [key: string]: Comment[] } = {};
  showReportDialog = false;
  reportReason = '';
  reportDescription = '';
  reportReasons = [
    { label: 'Spam', value: 'SPAM' },
    { label: 'Harassment', value: 'HARASSMENT' },
    { label: 'Hate Speech', value: 'HATE_SPEECH' },
    { label: 'Misinformation', value: 'MISINFORMATION' },
    { label: 'Inappropriate Content', value: 'INAPPROPRIATE_CONTENT' },
    { label: 'Copyright Violation', value: 'COPYRIGHT_VIOLATION' },
    { label: 'Other', value: 'OTHER' },
  ];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadBlog(params['slug']);
    });
  }

  loadBlog(slug: string) {
    this.loading.set(true);
    this.blogService.getBySlug(slug).subscribe({
      next: (res) => {
        this.blog.set(res.data);
        this.loading.set(false);
        if (res.data?._id) this.loadComments(res.data._id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadComments(blogId: string) {
    this.blogService.getComments(blogId).subscribe({
      next: (res) => this.comments.set(Array.isArray(res.data) ? res.data : []),
    });
  }

  toggleLike() {
    const b = this.blog();
    if (!b || !this.auth.isLoggedIn()) return;
    const action = b.isLiked ? this.blogService.unlike(b._id) : this.blogService.like(b._id);
    action.subscribe({
      next: () => {
        this.blog.set({ ...b, isLiked: !b.isLiked, likes: b.isLiked ? b.likes - 1 : b.likes + 1 });
      },
    });
  }

  toggleBookmark() {
    const b = this.blog();
    if (!b || !this.auth.isLoggedIn()) return;
    const action = b.isBookmarked
      ? this.bookmarkService.remove(b._id)
      : (this.bookmarkService.add(b._id) as Observable<ApiResponse<unknown>>);
    action.subscribe({
      next: () => {
        this.blog.set({ ...b, isBookmarked: !b.isBookmarked });
      },
    });
  }

  addComment() {
    const b = this.blog();
    if (!b || !this.newComment.trim()) return;
    this.blogService.addComment(b._id, this.newComment).subscribe({
      next: () => {
        this.newComment = '';
        this.loadComments(b._id);
      },
    });
  }

  toggleReplies(commentId: string) {
    const b = this.blog();
    if (!b) return;
    if (this.showReplies[commentId]) {
      delete this.showReplies[commentId];
    } else {
      this.blogService.getCommentReplies(b._id, commentId).subscribe({
        next: (res) => {
          this.showReplies[commentId] = Array.isArray(res.data) ? res.data : [];
        },
      });
    }
  }

  addReply(commentId: string) {
    const b = this.blog();
    if (!b || !this.replyContent[commentId]?.trim()) return;
    this.blogService.replyToComment(b._id, commentId, this.replyContent[commentId]).subscribe({
      next: () => {
        this.replyContent[commentId] = '';
        this.toggleReplies(commentId);
        this.toggleReplies(commentId);
        this.loadComments(b._id);
      },
    });
  }

  submitReport() {
    const b = this.blog();
    if (!b || !this.reportReason) return;
    this.reportService
      .report(b._id, { reason: this.reportReason, description: this.reportDescription })
      .subscribe({
        next: () => {
          this.showReportDialog = false;
          this.reportReason = '';
          this.reportDescription = '';
          this.message.add({
            severity: 'success',
            summary: 'Reported',
            detail: 'Blog post reported successfully',
          });
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to report',
          });
        },
      });
  }

  sanitizedContent = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.blog()!.content));

  constructor() {
    effect(() => {
      const _ = this.sanitizedContent();
      setTimeout(() => {
        this.el.nativeElement.querySelectorAll('pre').forEach((block: HTMLElement) => {
          hljs.highlight(block.textContent || '', {
            language: block.getAttribute('data-lang') || 'plaintext',
          });
        });
      }, 0);
    });
  }
}
