import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SearchBarComponent } from './shared/components/search-bar/search-bar';
import { ThemeService } from './core/services/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);

  readonly themeService = inject(ThemeService);
  readonly currentYear = new Date().getFullYear();

  goHome(): void {
    this.router.navigate(['/notes']);
  }
}