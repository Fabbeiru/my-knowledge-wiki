import { Injectable } from '@angular/core';
import { marked } from 'marked';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {

  constructor() {
    marked.setOptions({
      gfm: true,      // GitHub Flavored Markdown — tablas, código, etc.
      breaks: true,   // saltos de línea con \n
    });
  }

  render(markdown: string): string {
    return marked.parse(markdown) as string;
  }
}