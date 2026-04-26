import { Component, input } from '@angular/core';

@Component({
  selector: 'tag-badge',
  standalone: true,
  template: `<span class="tag-badge">{{ tag() }}</span>`,
  styles: [`
    .tag-badge {
      font-size: 10px;
      padding: 2px 7px;
      border-radius: 999px;
      background: var(--bg-tertiary);
      color: var(--text-tertiary);
      border: 1px solid var(--border);
      white-space: nowrap;
      font-weight: 500;
    }
  `]
})
export class TagBadgeComponent {
  tag = input.required<string>();
}