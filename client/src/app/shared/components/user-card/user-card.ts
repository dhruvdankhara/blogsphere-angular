import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';

export interface UserCardData {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
}

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [RouterLink, Avatar, Button],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  user = input.required<UserCardData>();
  showFollowBtn = input(false);
  followClick = output<string>();

  onFollow() {
    this.followClick.emit(this.user().username);
  }
}
