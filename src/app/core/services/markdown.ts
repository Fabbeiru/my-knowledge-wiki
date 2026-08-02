import { Injectable, inject } from '@angular/core';
import { marked } from 'marked';
import { NotesService } from './notes';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private notesService = inject(NotesService);

  constructor() {
    marked.setOptions({
      gfm: true,      // GitHub Flavored Markdown — tablas, código, etc.
      breaks: true,   // saltos de línea con \n
    });
  }

  render(markdown: string): string {
    return marked.parse(this.resolveWikilinks(markdown)) as string;
  }

  // Convierte [[nota-id]] en un link markdown normal hacia esa nota.
  // Si el id no corresponde a ninguna nota, deja el texto tal cual
  // en vez de generar un enlace roto.
  private resolveWikilinks(markdown: string): string {
    return markdown.replace(/\[\[([a-z0-9-]+)\]\]/g, (match, id) => {
      const note = this.notesService.getNoteById(id);
      return note ? `[${note.title}](/notes/${id})` : match;
    });
  }
}