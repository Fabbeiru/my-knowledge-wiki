import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'not-found',
  standalone: true,
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFoundComponent {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(['/notes']);
  }
}