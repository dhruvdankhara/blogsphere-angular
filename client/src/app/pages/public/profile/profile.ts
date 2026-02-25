import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user';
import { AuthService } from '../../../core/services/auth';
import { UserProfile, Blog } from '../../../core/models/index';
import { BlogCard } from '../../../shared/components/blog-card/blog-card';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { TabPanel, Tabs, Tab, TabList, TabPanels } from 'primeng/tabs';
import { ProgressSpinner } from 'primeng/progressspinner';
import { UserCard, UserCardData } from '../../../shared/components/user-card/user-card';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    BlogCard,
    Avatar,
    Button,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    ProgressSpinner,
    UserCard,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  auth = inject(AuthService);

  profile = signal<UserProfile | null>(null);
  blogs = signal<Blog[]>([]);
  followers = signal<UserCardData[]>([]);
  following = signal<UserCardData[]>([]);
  loading = signal(true);
  activeTab = signal(0);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadProfile(params['username']);
    });
  }

  loadProfile(username: string) {
    this.loading.set(true);
    this.userService.getProfile(username).subscribe({
      next: (res) => {
        this.profile.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.userService.getUserPosts(username).subscribe({
      next: (res) => this.blogs.set(res.data || []),
    });
  }

  loadFollowers() {
    const p = this.profile();
    if (!p) return;
    this.userService.getFollowers(p.username).subscribe({
      next: (res) => this.followers.set(res.data || []),
    });
  }

  loadFollowing() {
    const p = this.profile();
    if (!p) return;
    this.userService.getFollowing(p.username).subscribe({
      next: (res) => this.following.set(res.data || []),
    });
  }

  toggleFollow() {
    const p = this.profile();
    if (!p) return;
    const action = p.isFollowing
      ? this.userService.unfollow(p.username)
      : this.userService.follow(p.username);
    action.subscribe({
      next: () => {
        this.profile.set({
          ...p,
          isFollowing: !p.isFollowing,
          followers: p.isFollowing ? p.followers - 1 : p.followers + 1,
        });
      },
    });
  }

  onTabChange(index: number) {
    this.activeTab.set(index);
    if (index === 1) this.loadFollowers();
    if (index === 2) this.loadFollowing();
  }

  isSelf(): boolean {
    return this.auth.user()?.username === this.profile()?.username;
  }
}
