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
    { label: 'Dashboard', icon: 'fa-solid fa-chart-line', route: '/admin' },
    { label: 'Users', icon: 'fa-solid fa-users', route: '/admin/users' },
    { label: 'Blogs', icon: 'fa-regular fa-file-lines', route: '/admin/blogs' },
    { label: 'Reports', icon: 'fa-regular fa-flag', route: '/admin/reports' },
    { label: 'Categories', icon: 'fa-solid fa-table-cells-large', route: '/admin/categories' },
    { label: 'Tags', icon: 'fa-solid fa-tags', route: '/admin/tags' },
  ];

  logout() {
    this.auth.logout().subscribe();
  }
}
