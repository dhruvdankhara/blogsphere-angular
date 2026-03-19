import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { UserService, FollowUser } from '../../core/services/user';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Avatar],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);
  private userService = inject(UserService);

  followingUsers = signal<FollowUser[]>([]);
  showAvatarMenu = signal(false);

  navItems = [
    { label: 'Home', icon: 'fa-solid fa-house', route: '/' },
    { label: 'Search', icon: 'fa-solid fa-magnifying-glass', route: '/search' },
    { label: 'Explore', icon: 'fa-solid fa-compass', route: '/explore' },
    { label: 'Bookmarks', icon: 'fa-regular fa-bookmark', route: '/library' },
    { label: 'Profile', icon: 'fa-regular fa-user', route: '/profile' },
    { label: 'Stories', icon: 'fa-regular fa-file-lines', route: '/stories' },
    { label: 'Stats', icon: 'fa-solid fa-chart-simple', route: '/stats' },
    { label: 'Settings', icon: 'fa-solid fa-gear', route: '/settings' },
  ];

  ngOnInit() {
    const username = this.auth.user()?.username;
    if (username) {
      this.navItems[4].route = `/profile/${username}`;
      this.userService.getFollowing(username).subscribe({
        next: (res) => this.followingUsers.set(res.data || []),
      });
    }
  }

  getProfileRoute(): string {
    return `/profile/${this.auth.user()?.username}`;
  }

  toggleAvatarMenu(event: Event) {
    event.stopPropagation();
    this.showAvatarMenu.update((v) => !v);
  }

  closeAvatarMenu() {
    this.showAvatarMenu.set(false);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeAvatarMenu();
  }

  getMaskedEmail(): string {
    const email = this.auth.user()?.email || '';
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    const masked = local.substring(0, 2) + '\u2022'.repeat(Math.max(local.length - 2, 4));
    return `${masked}@${domain}`;
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
