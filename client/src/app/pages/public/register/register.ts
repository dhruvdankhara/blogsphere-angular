import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, InputText, Button, Password],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);
  private message = inject(MessageService);

  name = '';
  email = '';
  username = '';
  password = '';
  loading = signal(false);

  onSubmit() {
    if (!this.name || !this.email || !this.username || !this.password) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'All fields are required',
      });
      return;
    }
    if (this.password.length < 8) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Password must be at least 8 characters',
      });
      return;
    }
    this.loading.set(true);
    this.auth
      .register({
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.message.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account created! Please sign in.',
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.loading.set(false);
          this.message.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: err.error?.message || 'Something went wrong',
          });
        },
      });
  }
}
