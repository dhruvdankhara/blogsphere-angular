import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin';
import { User } from '../../../core/models/index';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';
import { ProgressSpinner } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [DatePipe, TableModule, Button, InputText, Select, Avatar, ProgressSpinner, FormsModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {
  private adminService = inject(AdminService);
  private confirmService = inject(ConfirmationService);
  private message = inject(MessageService);

  users = signal<User[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  totalRecords = signal(0);

  roleOptions = [
    { label: 'User', value: 'USER' },
    { label: 'Admin', value: 'ADMIN' },
  ];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    const params: { search?: string; page?: number; limit?: number } = { limit: 50 };
    const search = this.searchQuery();
    if (search) {
      params.search = search;
    }
    this.adminService.getUsers(params).subscribe({
      next: (res) => {
        this.users.set(res.data.users);
        this.totalRecords.set(res.data.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch() {
    this.loadUsers();
  }

  onRoleChange(userId: string, role: string) {
    this.adminService.updateUserRole(userId, role).subscribe({
      next: () => {
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User role updated successfully',
        });
      },
      error: (err) => {
        this.message.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to update role',
        });
        this.loadUsers();
      },
    });
  }

  deleteUser(user: User) {
    this.confirmService.confirm({
      message: `Are you sure you want to delete user "${user.name}"?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-trash',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.deleteUser(user._id).subscribe({
          next: () => {
            this.message.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'User deleted successfully',
            });
            this.loadUsers();
          },
          error: (err) => {
            this.message.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete user',
            });
          },
        });
      },
    });
  }
}
