import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _theme = signal<Theme>(this.getInitialTheme());
  readonly theme = this._theme.asReadonly();
  readonly isDark = () => this._theme() === 'dark';

  constructor() {
    effect(() => {
      const theme = this._theme();
      const html = document.documentElement;
      html.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    });
  }

  toggle(): void {
    this._theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  private getInitialTheme(): Theme {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}