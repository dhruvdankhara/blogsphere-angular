import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar, Menu],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout {
  auth = inject(AuthService);
  router = inject(Router);
  userMenuItems: MenuItem[] = [];

  navItems = [
    { label: 'Home', icon: 'pi pi-home', route: '/dashboard' },
    { label: 'Following', icon: 'pi pi-users', route: '/following' },
    { label: 'Create', icon: 'pi pi-plus-circle', route: '/create' },
    { label: 'My Blogs', icon: 'pi pi-file', route: '/my-blogs' },
    { label: 'Bookmarks', icon: 'pi pi-bookmark', route: '/bookmarks' },
    { label: 'Notifications', icon: 'pi pi-bell', route: '/notifications' },
    { label: 'Settings', icon: 'pi pi-cog', route: '/settings' },
  ];

  ngOnInit() {
    this.userMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile', this.auth.user()?.username]),
      },
      { separator: true },
      { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.auth.logout().subscribe() },
    ];
  }
}
