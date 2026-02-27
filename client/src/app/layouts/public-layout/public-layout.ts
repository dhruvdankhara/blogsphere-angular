import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Avatar } from 'primeng/avatar';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, Menubar, Button, InputText, Avatar, Menu],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  auth = inject(AuthService);
  router = inject(Router);
  searchQuery = '';
  userMenuItems: MenuItem[] = [];
  userMenuVisible = false;

  ngOnInit() {
    this.userMenuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/']),
      },
      {
        label: 'Stories',
        icon: 'pi pi-file-edit',
        command: () => this.router.navigate(['/stories']),
      },
      {
        label: 'Library',
        icon: 'pi pi-bookmark',
        command: () => this.router.navigate(['/library']),
      },
      { label: 'Settings', icon: 'pi pi-cog', command: () => this.router.navigate(['/settings']) },
      { separator: true },
      { label: 'Sign Out', icon: 'pi pi-sign-out', command: () => this.logout() },
    ];
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
