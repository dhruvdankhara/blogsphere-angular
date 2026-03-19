import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Blog } from '../../../core/models/index';
import { Avatar } from 'primeng/avatar';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink, DatePipe, Avatar, Tag],
  templateUrl: './blog-card.html',
  styleUrl: './blog-card.css',
})
export class BlogCard {
  blog = input.required<Blog>();

  getContentPreview(): string {
    const text = this.blog().content.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  }

  getReadTime(): number {
    const words = this.blog()
      .content.replace(/<[^>]*>/g, '')
      .split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }
}
