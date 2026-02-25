import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tag-chip',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tag-chip.html',
  styleUrl: './tag-chip.css',
})
export class TagChip {
  name = input.required<string>();
  slug = input.required<string>();
}
