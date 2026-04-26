import { Component, input } from '@angular/core';

@Component({
  selector: 'skeleton-card',
  standalone: true,
  templateUrl: './skeleton-card.html',
  styleUrl: './skeleton-card.scss',
  host: {
    'style': 'display: block; width: 100%;'
  }
})
export class SkeletonCardComponent {
  items = Array.from({ length: 6 });
}