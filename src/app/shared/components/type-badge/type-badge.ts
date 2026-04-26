import { Component, input, computed } from '@angular/core';
import { NoteType } from '../../models/note';

const TYPE_STYLES: Record<NoteType, { lightBg: string; lightColor: string; darkBg: string; darkColor: string; label: string }> = {
  acronym: { lightBg: '#dbeafe', lightColor: '#1e3a8a', darkBg: '#1e3a5f', darkColor: '#93c5fd', label: 'Acronym' },
  concept: { lightBg: '#ede9fe', lightColor: '#4c1d95', darkBg: '#2e1f5e', darkColor: '#c4b5fd', label: 'Concept' },
  definition: { lightBg: '#d1fae5', lightColor: '#064e3b', darkBg: '#0d3d2e', darkColor: '#6ee7b7', label: 'Definition' },
  tip: { lightBg: '#fef3c7', lightColor: '#78350f', darkBg: '#3d2a0a', darkColor: '#fcd34d', label: 'Tip' },
  pattern: { lightBg: '#ffe4e6', lightColor: '#881337', darkBg: '#3d0d18', darkColor: '#fda4af', label: 'Pattern' },
};

@Component({
  selector: 'type-badge',
  standalone: true,
  template: `
    <span class="type-badge" [attr.data-type]="type()">
      {{ styles().label }}
    </span>
  `,
  styles: [`
    .type-badge {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 999px;
      font-weight: 600;
      white-space: nowrap;
      letter-spacing: 0.02em;
    }
    .type-badge[data-type="acronym"]    { background: #dbeafe; color: #1e3a8a; }
    .type-badge[data-type="concept"]    { background: #ede9fe; color: #4c1d95; }
    .type-badge[data-type="definition"] { background: #d1fae5; color: #064e3b; }
    .type-badge[data-type="tip"]        { background: #fef3c7; color: #78350f; }
    .type-badge[data-type="pattern"]    { background: #ffe4e6; color: #881337; }

    :host-context(html.dark) .type-badge[data-type="acronym"]    { background: #1e3a5f; color: #93c5fd; }
    :host-context(html.dark) .type-badge[data-type="concept"]    { background: #2e1f5e; color: #c4b5fd; }
    :host-context(html.dark) .type-badge[data-type="definition"] { background: #0d3d2e; color: #6ee7b7; }
    :host-context(html.dark) .type-badge[data-type="tip"]        { background: #3d2a0a; color: #fcd34d; }
    :host-context(html.dark) .type-badge[data-type="pattern"]    { background: #3d0d18; color: #fda4af; }
  `]
})
export class TypeBadgeComponent {
  type = input.required<NoteType>();
  styles = computed(() => TYPE_STYLES[this.type()]);
}