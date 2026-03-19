import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { Password } from 'primeng/password';
import { Avatar } from 'primeng/avatar';
import { FileUpload } from 'primeng/fileupload';
import { Divider } from 'primeng/divider';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    InputText,
    Textarea,
    Button,
    Select,
    Password,
    Avatar,
    FileUpload,
    Divider,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  auth = inject(AuthService);
  private message = inject(MessageService);

  name = '';
  username = '';
  email = '';
  bio = '';
  gender = '';
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  savingProfile = signal(false);
  savingPassword = signal(false);

  ngOnInit() {
    const user = this.auth.user();
    if (user) {
      this.name = user.name;
      this.username = user.username;
      this.email = user.email;
      this.bio = user.bio || '';
      this.gender = user.gender || '';
    }
  }

  saveProfile() {
    this.savingProfile.set(true);
    this.auth
      .updateUser({
        name: this.name,
        username: this.username,
        email: this.email,
        bio: this.bio,
        gender: this.gender,
      })
      .subscribe({
        next: () => {
          this.savingProfile.set(false);
          this.message.add({ severity: 'success', summary: 'Saved', detail: 'Profile updated' });
        },
        error: (err) => {
          this.savingProfile.set(false);
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to update',
          });
        },
      });
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'All password fields are required',
      });
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'New passwords do not match',
      });
      return;
    }
    this.savingPassword.set(true);
    this.auth
      .changePassword({ oldPassword: this.oldPassword, newPassword: this.newPassword })
      .subscribe({
        next: () => {
          this.savingPassword.set(false);
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.message.add({ severity: 'success', summary: 'Saved', detail: 'Password changed' });
        },
        error: (err) => {
          this.savingPassword.set(false);
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Failed to change password',
          });
        },
      });
  }

  onAvatarSelect(event: any) {
    const file = event.files?.[0];
    if (file) {
      this.auth.updateAvatar(file).subscribe({
        next: () =>
          this.message.add({ severity: 'success', summary: 'Saved', detail: 'Avatar updated' }),
        error: () =>
          this.message.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update avatar',
          }),
      });
    }
  }
}
