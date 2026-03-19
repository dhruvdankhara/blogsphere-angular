import { Component, inject, OnInit, signal, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog';
import { TagService } from '../../../core/services/tag';
import { CategoryService } from '../../../core/services/category';
import { Tag, Category } from '../../../core/models/index';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Editor } from 'primeng/editor';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FileUpload } from 'primeng/fileupload';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [
    FormsModule,
    InputText,
    Button,
    Editor,
    Select,
    ToggleSwitch,
    FileUpload,
    ProgressSpinner,
  ],
  templateUrl: './edit-blog.html',
  styleUrl: './edit-blog.css',
})
export class EditBlog implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private tagService = inject(TagService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private message = inject(MessageService);

  @ViewChild('tagInputEl') tagInputRef!: ElementRef<HTMLInputElement>;

  originalSlug = '';
  title = '';
  slug = '';
  content = '';
  selectedCategory: string | null = null;
  selectedTags: string[] = [];
  isDraft = false;
  isPublic = true;
  featureImageFile: File | null = null;
  featureImagePreview = '';

  tagInput = '';
  suggestions = signal<Tag[]>([]);
  showSuggestions = false;
  categories = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);

  readonly MAX_TAGS = 5;

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.categoryService.getAll().subscribe({ next: (res) => this.categories.set(res.data || []) });

    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((q) => this.tagService.search(q)),
      )
      .subscribe({
        next: (res) => {
          const existing = res.data || [];
          const filtered = existing.filter((t) => !this.selectedTags.includes(t.name));
          this.suggestions.set(filtered);
          this.showSuggestions = filtered.length > 0;
        },
      });

    this.route.params.subscribe((params) => {
      this.originalSlug = params['slug'];
      this.blogService.getBySlug(this.originalSlug).subscribe({
        next: (res) => {
          const blog = res.data;
          this.title = blog.title;
          this.slug = blog.slug;
          this.content = blog.content;
          this.isDraft = blog.isDraft;
          this.isPublic = blog.isPublic;
          this.selectedCategory = blog.category?._id || null;
          this.selectedTags = (blog.tags || []).map((t) => t.name);
          this.featureImagePreview = blog.featureImage || '';
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }

  onTagInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^a-z0-9]/gi, '').toLowerCase();
    this.tagInput = cleaned;
    input.value = cleaned;

    if (cleaned.length >= 1) {
      this.searchSubject.next(cleaned);
    } else {
      this.suggestions.set([]);
      this.showSuggestions = false;
    }
  }

  onTagInputFocus() {
    if (this.tagInput.length >= 1) {
      this.searchSubject.next(this.tagInput);
    }
  }

  onTagKeydown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addCurrentTag();
    } else if (event.key === 'Backspace' && !this.tagInput && this.selectedTags.length) {
      this.selectedTags = this.selectedTags.slice(0, -1);
    }
  }

  addCurrentTag() {
    const name = this.tagInput
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    if (!name) return;
    if (this.selectedTags.length >= this.MAX_TAGS) {
      this.message.add({
        severity: 'warn',
        summary: 'Limit reached',
        detail: `Maximum ${this.MAX_TAGS} tags allowed`,
      });
      return;
    }
    if (this.selectedTags.includes(name)) {
      this.tagInput = '';
      this.showSuggestions = false;
      return;
    }
    this.selectedTags = [...this.selectedTags, name];
    this.tagInput = '';
    this.suggestions.set([]);
    this.showSuggestions = false;
  }

  selectSuggestion(tag: Tag) {
    if (this.selectedTags.length >= this.MAX_TAGS) {
      this.message.add({
        severity: 'warn',
        summary: 'Limit reached',
        detail: `Maximum ${this.MAX_TAGS} tags allowed`,
      });
      return;
    }
    if (!this.selectedTags.includes(tag.name)) {
      this.selectedTags = [...this.selectedTags, tag.name];
    }
    this.tagInput = '';
    this.suggestions.set([]);
    this.showSuggestions = false;
    this.tagInputRef?.nativeElement?.focus();
  }

  removeTag(name: string) {
    this.selectedTags = this.selectedTags.filter((t) => t !== name);
  }

  onTagInputBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onImageSelect(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.featureImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.featureImagePreview = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.featureImageFile = null;
    this.featureImagePreview = '';
  }

  onSubmit() {
    if (!this.title || !this.slug || !this.content) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Title, slug, and content are required',
      });
      return;
    }

    this.saving.set(true);

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('slug', this.slug);
    formData.append('content', this.content);
    formData.append('isDraft', String(this.isDraft));
    formData.append('isPublic', String(this.isPublic));
    if (this.selectedCategory) formData.append('category', this.selectedCategory);
    formData.append('tags', JSON.stringify(this.selectedTags));
    if (this.featureImageFile) formData.append('featureImage', this.featureImageFile);

    this.blogService.update(this.originalSlug, formData).subscribe({
      next: (res) => {
        this.message.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Blog post updated successfully',
        });
        this.router.navigate(['/blog', res.data?.slug || this.slug]);
      },
      error: (err) => {
        this.saving.set(false);
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to update',
        });
      },
    });
  }
}
