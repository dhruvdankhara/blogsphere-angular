import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../../core/services/category';
import { Category } from '../../../core/models/index';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [TableModule, Button, InputText, Dialog, ProgressSpinner, FormsModule, Textarea],
  templateUrl: './manage-categories.html',
  styleUrl: './manage-categories.css',
})
export class ManageCategories implements OnInit {
  private categoryService = inject(CategoryService);
  private confirmService = inject(ConfirmationService);
  private message = inject(MessageService);

  categories = signal<Category[]>([]);
  loading = signal(true);

  dialogVisible = signal(false);
  dialogMode = signal<'create' | 'edit'>('create');
  saving = signal(false);

  formName = signal('');
  formSlug = signal('');
  formDescription = signal('');
  selectedFile = signal<File | null>(null);
  editingId = signal('');

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreateDialog() {
    this.dialogMode.set('create');
    this.formName.set('');
    this.formSlug.set('');
    this.formDescription.set('');
    this.selectedFile.set(null);
    this.editingId.set('');
    this.dialogVisible.set(true);
  }

  openEditDialog(category: Category) {
    this.dialogMode.set('edit');
    this.formName.set(category.name);
    this.formSlug.set(category.slug);
    this.formDescription.set(category.description);
    this.selectedFile.set(null);
    this.editingId.set(category._id);
    this.dialogVisible.set(true);
  }

  onNameChange(value: string) {
    this.formName.set(value);
    if (this.dialogMode() === 'create') {
      this.formSlug.set(
        value
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      );
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  saveCategory() {
    const name = this.formName().trim();
    const slug = this.formSlug().trim();
    if (!name || !slug) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Name and slug are required',
      });
      return;
    }

    this.saving.set(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', this.formDescription().trim());
    const file = this.selectedFile();
    if (file) {
      formData.append('featureImage', file);
    }

    if (this.dialogMode() === 'create') {
      this.categoryService.create(formData).subscribe({
        next: () => {
          this.message.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Category created successfully',
          });
          this.dialogVisible.set(false);
          this.saving.set(false);
          this.loadCategories();
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create category',
          });
          this.saving.set(false);
        },
      });
    } else {
      this.categoryService.update(this.editingId(), formData).subscribe({
        next: () => {
          this.message.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Category updated successfully',
          });
          this.dialogVisible.set(false);
          this.saving.set(false);
          this.loadCategories();
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update category',
          });
          this.saving.set(false);
        },
      });
    }
  }

  deleteCategory(category: Category) {
    this.confirmService.confirm({
      message: `Are you sure you want to delete category "${category.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.categoryService.delete(category._id).subscribe({
          next: () => {
            this.message.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Category deleted successfully',
            });
            this.loadCategories();
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete category',
            });
          },
        });
      },
    });
  }
}
