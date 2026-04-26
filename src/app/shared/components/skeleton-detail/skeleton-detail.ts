import { Component } from '@angular/core';

@Component({
  selector: 'skeleton-detail',
  standalone: true,
  templateUrl: './skeleton-detail.html',
  styleUrl: './skeleton-detail.scss',
  host: {
    'style': 'display: block; width: 100%;'
  }
})
export class SkeletonDetailComponent { }