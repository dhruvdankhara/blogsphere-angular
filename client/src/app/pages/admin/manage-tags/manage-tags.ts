import { Component, inject, OnInit, signal } from '@angular/core';
import { TagService } from '../../../core/services/tag';
import { Tag } from '../../../core/models/index';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-tags',
  standalone: true,
  imports: [TableModule, Button, InputText, Dialog, ProgressSpinner, FormsModule],
  templateUrl: './manage-tags.html',
  styleUrl: './manage-tags.css',
})
export class ManageTags implements OnInit {
  private tagService = inject(TagService);
  private confirmService = inject(ConfirmationService);
  private message = inject(MessageService);

  tags = signal<Tag[]>([]);
  loading = signal(true);

  dialogVisible = signal(false);
  dialogMode = signal<'create' | 'edit'>('create');
  saving = signal(false);

  formName = signal('');
  formSlug = signal('');
  editingId = signal('');

  ngOnInit() {
    this.loadTags();
  }

  loadTags() {
    this.loading.set(true);
    this.tagService.getAll().subscribe({
      next: (res) => {
        this.tags.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openCreateDialog() {
    this.dialogMode.set('create');
    this.formName.set('');
    this.formSlug.set('');
    this.editingId.set('');
    this.dialogVisible.set(true);
  }

  openEditDialog(tag: Tag) {
    this.dialogMode.set('edit');
    this.formName.set(tag.name);
    this.formSlug.set(tag.slug);
    this.editingId.set(tag._id);
    this.dialogVisible.set(true);
  }

  onNameChange(value: string) {
    this.formName.set(value);
    this.formSlug.set(
      value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    );
  }

  saveTag() {
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

    if (this.dialogMode() === 'create') {
      this.tagService.create({ name, slug }).subscribe({
        next: () => {
          this.message.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Tag created successfully',
          });
          this.dialogVisible.set(false);
          this.saving.set(false);
          this.loadTags();
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to create tag',
          });
          this.saving.set(false);
        },
      });
    } else {
      this.tagService.update(this.editingId(), { name, slug }).subscribe({
        next: () => {
          this.message.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Tag updated successfully',
          });
          this.dialogVisible.set(false);
          this.saving.set(false);
          this.loadTags();
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update tag',
          });
          this.saving.set(false);
        },
      });
    }
  }

  deleteTag(tag: Tag) {
    this.confirmService.confirm({
      message: `Are you sure you want to delete tag "${tag.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.tagService.delete(tag._id).subscribe({
          next: () => {
            this.message.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Tag deleted successfully',
            });
            this.loadTags();
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete tag',
            });
          },
        });
      },
    });
  }
}
