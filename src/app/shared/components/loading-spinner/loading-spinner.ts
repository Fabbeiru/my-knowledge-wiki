import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-wrap" [class.fullscreen]="fullscreen()">
      <div class="spinner"></div>
      @if (message()) {
        <span class="spinner-message">{{ message() }}</span>
      }
    </div>
  `,
  styles: [`
    .spinner-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 48px;

      &.fullscreen {
        position: fixed;
        inset: 0;
        background: rgba(255,255,255,0.8);
        z-index: 999;
      }
    }

    .spinner {
      width: 28px;
      height: 28px;
      border: 2.5px solid #e5e7eb;
      border-top-color: oklch(51.01% 0.274 263.83);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .spinner-message {
      font-size: 13px;
      color: #9ca3af;
    }
  `]
})
export class LoadingSpinnerComponent {
  fullscreen = input(false);
  message = input('');
}