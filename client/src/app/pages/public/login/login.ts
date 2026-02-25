import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, InputText, Button, Password],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private message = inject(MessageService);

  username = '';
  password = '';
  loading = signal(false);

  onSubmit() {
    if (!this.username || !this.password) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'All fields are required',
      });
      return;
    }
    this.loading.set(true);
    const isEmail = this.username.includes('@');
    const payload = isEmail
      ? { email: this.username, password: this.password }
      : { username: this.username, password: this.password };

    this.auth.login(payload).subscribe({
      next: () => {
        this.auth.getMe().subscribe(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.message.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.error?.message || 'Invalid credentials',
        });
      },
    });
  }
}
