import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Note, NoteType } from '../../shared/models/note';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly _notes = signal<Note[]>([]);
  private readonly _selectedType = signal<NoteType | null>(null);
  private readonly _selectedTags = signal<string[]>([]);
  private readonly _searchQuery = signal<string>('');
  private readonly _loading = signal(false);

  readonly loading = this._loading.asReadonly();
  readonly allNotes = this._notes.asReadonly();
  readonly selectedType = this._selectedType.asReadonly();
  readonly selectedTags = this._selectedTags.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();

  readonly filteredNotes = computed(() => {
    let notes = this._notes();

    const type = this._selectedType();
    if (type) {
      notes = notes.filter(n => n.type === type);
    }

    const tags = this._selectedTags();
    if (tags.length > 0) {
      notes = notes.filter(n => tags.every(t => n.tags.includes(t)));
    }

    const query = this._searchQuery().toLowerCase().trim();
    if (query) {
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        n.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return notes;
  });

  readonly allTags = computed(() => {
    // Los tags se calculan sobre las notas ya filtradas por tipo
    // pero SIN tener en cuenta los tags seleccionados
    // así siempre ves todos los tags disponibles para el tipo actual
    let notes = this._notes();

    const type = this._selectedType();
    if (type) {
      notes = notes.filter(n => n.type === type);
    }

    const query = this._searchQuery().toLowerCase().trim();
    if (query) {
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query) ||
        n.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    const tags = notes.flatMap(n => n.tags);
    return [...new Set(tags)].sort();
  });

  readonly notesCountByType = computed(() => {
    const counts: Record<string, number> = {};
    for (const note of this._notes()) {
      counts[note.type] = (counts[note.type] ?? 0) + 1;
    }
    return counts;
  });

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.loadNotes();
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        // Si navegamos al detalle de una nota limpiamos la búsqueda
        // pero mantenemos tipo y tags para que al volver el filtro siga activo
        if (e.url.includes('/notes/')) {
          this._searchQuery.set('');
        }
      });
  }

  getNoteById(id: string): Note | undefined {
    return this._notes().find(n => n.id === id);
  }

  setType(type: NoteType | null): void {
    this._selectedType.set(type);
    this._selectedTags.set([]);
  }

  toggleTag(tag: string): void {
    const current = this._selectedTags();
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    this._selectedTags.set(updated);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  clearFilters(): void {
    this._selectedType.set(null);
    this._selectedTags.set([]);
    this._searchQuery.set('');
  }

  private loadNotes(): void {
    this._loading.set(true);
    this.http.get<{ notes: Note[] }>('assets/data/notes.json').subscribe({
      next: (data) => {
        // Quitar el setTimeout en producción
        setTimeout(() => {
          this._notes.set(data.notes);
          this._loading.set(false);
        }, 3000);
      },
      error: (err) => {
        console.error('Error cargando notas:', err);
        this._loading.set(false);
      }
    });
  }
}