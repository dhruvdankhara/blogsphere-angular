import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog';
import { TagService } from '../../../core/services/tag';
import { CategoryService } from '../../../core/services/category';
import { Tag, Category, BlogDetail } from '../../../core/models/index';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Editor } from 'primeng/editor';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { FileUpload } from 'primeng/fileupload';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [
    FormsModule,
    InputText,
    Button,
    Editor,
    Select,
    MultiSelect,
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

  tags = signal<Tag[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);

  ngOnInit() {
    this.tagService.getAll().subscribe({ next: (res) => this.tags.set(res.data || []) });
    this.categoryService.getAll().subscribe({ next: (res) => this.categories.set(res.data || []) });

    this.route.params.subscribe((params) => {
      this.originalSlug = params['blogId'];
      this.blogService.getBySlug(this.originalSlug).subscribe({
        next: (res) => {
          const blog = res.data;
          this.title = blog.title;
          this.slug = blog.slug;
          this.content = blog.content;
          this.isDraft = blog.isDraft;
          this.isPublic = blog.isPublic;
          this.selectedCategory = blog.category?._id || null;
          this.selectedTags = blog.tags?.map((t) => t._id) || [];
          this.featureImagePreview = blog.featureImage || '';
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
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
