import { Component, inject, computed, ElementRef, effect } from '@angular/core';
import { MarkdownService } from '../../../core/services/markdown';
import { Input } from '@angular/core';

@Component({
  selector: 'markdown-renderer',
  standalone: true,
  template: `<div class="prose-content"></div>`,
  styles: [`
  .prose-content {
    font-size: 13px;
    line-height: 1.8;
    color: var(--text-secondary);

    :host ::ng-deep {
      h1, h2, h3 {
        color: var(--text-primary);
        font-weight: 600;
        margin: 16px 0 8px;
      }
      h2 { font-size: 15px; }
      h3 { font-size: 13px; }
      p { margin: 8px 0; color: var(--text-secondary); }
      strong { color: var(--text-primary); font-weight: 600; }

      code {
        font-family: 'Fira Code', 'Cascadia Code', monospace;
        font-size: 12px;
        background: var(--bg-tertiary);
        padding: 1px 6px;
        border-radius: 4px;
        color: var(--text-primary);
      }

      pre {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 12px 16px;
        overflow-x: auto;
        margin: 12px 0;

        code {
          background: transparent;
          padding: 0;
          font-size: 12px;
          color: var(--text-primary);
        }
      }

      ul, ol { padding-left: 20px; margin: 8px 0; }
      li { margin: 4px 0; color: var(--text-secondary); }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        font-size: 12px;
      }
      th {
        background: var(--bg-tertiary);
        padding: 6px 10px;
        text-align: left;
        border: 1px solid var(--border);
        font-weight: 600;
        color: var(--text-primary);
      }
      td {
        padding: 6px 10px;
        border: 1px solid var(--border);
        color: var(--text-secondary);
      }

      blockquote {
        border-left: 3px solid var(--accent);
        padding-left: 12px;
        color: var(--text-tertiary);
        margin: 12px 0;
        font-style: italic;
      }

      a {
        color: var(--accent);
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }
  }
`]
})
export class MarkdownRendererComponent {
  @Input() content!: string;

  constructor(private markdownService: MarkdownService, private el: ElementRef) {
    effect(() => {
      const rendered = this.markdownService.render(this.content);
      this.el.nativeElement.querySelector('.prose-content').innerHTML = rendered;
    });
  }
}