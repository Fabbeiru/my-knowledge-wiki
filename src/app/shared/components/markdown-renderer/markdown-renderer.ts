import { Component, ElementRef, effect, input, output } from '@angular/core';
import { MarkdownService } from '../../../core/services/markdown';

export interface MarkdownHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

@Component({
  selector: 'markdown-renderer',
  standalone: true,
  templateUrl: './markdown-renderer.html',
  styleUrl: './markdown-renderer.scss'
})
export class MarkdownRendererComponent {
  readonly content = input.required<string>();
  readonly headingsChange = output<MarkdownHeading[]>();

  constructor(private markdownService: MarkdownService, private el: ElementRef) {
    effect(() => {
      const rendered = this.markdownService.render(this.content());
      const container = this.el.nativeElement.querySelector('.prose-content');
      container.innerHTML = rendered;
      this.headingsChange.emit(this.assignHeadingIds(container));
    });
  }

  private assignHeadingIds(container: HTMLElement): MarkdownHeading[] {
    const seen = new Set<string>();
    const headings: MarkdownHeading[] = [];

    container.querySelectorAll('h2, h3').forEach((el) => {
      const text = el.textContent?.trim() ?? '';
      const base = text
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'seccion';

      let id = base;
      let n = 1;
      while (seen.has(id)) id = `${base}-${++n}`;
      seen.add(id);

      el.id = id;
      headings.push({ id, text, level: el.tagName === 'H2' ? 2 : 3 });
    });

    return headings;
  }
}