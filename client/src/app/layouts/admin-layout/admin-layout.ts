import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar, Button],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  auth = inject(AuthService);
  router = inject(Router);

  navItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', route: '/admin' },
    { label: 'Users', icon: 'pi pi-users', route: '/admin/users' },
    { label: 'Blogs', icon: 'pi pi-file', route: '/admin/blogs' },
    { label: 'Reports', icon: 'pi pi-flag', route: '/admin/reports' },
    { label: 'Categories', icon: 'pi pi-th-large', route: '/admin/categories' },
    { label: 'Tags', icon: 'pi pi-tags', route: '/admin/tags' },
  ];

  logout() {
    this.auth.logout().subscribe();
  }
}
