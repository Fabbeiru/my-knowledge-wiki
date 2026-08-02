import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Note, NoteType } from '../../shared/models/note';

const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

/** Convierte "YYYY-MM" en una etiqueta legible, p.ej. "Agosto 2026". */
function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const name = MONTH_NAMES[Number(month) - 1];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private readonly _notes = signal<Note[]>([]);
  private readonly _selectedType = signal<NoteType | null>(null);
  private readonly _selectedTags = signal<string[]>([]);
  private readonly _selectedMonth = signal<string | null>(null);
  private readonly _searchQuery = signal<string>('');
  private readonly _loading = signal(false);

  readonly loading = this._loading.asReadonly();
  readonly allNotes = this._notes.asReadonly();
  readonly selectedType = this._selectedType.asReadonly();
  readonly selectedTags = this._selectedTags.asReadonly();
  readonly selectedMonth = this._selectedMonth.asReadonly();
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

    const month = this._selectedMonth();
    if (month) {
      notes = notes.filter(n => n.createdAt.startsWith(month));
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

  /** Meses (año-mes) presentes en las notas, más recientes primero. */
  readonly allMonths = computed(() => {
    const months = new Set(this._notes().map(n => n.createdAt.slice(0, 7)));
    return [...months]
      .sort()
      .reverse()
      .map(value => ({ value, label: formatMonthLabel(value) }));
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

  readonly allTagsWithCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const note of this._notes()) {
      for (const tag of note.tags) counts[tag] = (counts[tag] ?? 0) + 1;
    }
    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
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

  toggleType(type: NoteType): void {
    this.setType(this._selectedType() === type ? null : type);
  }

  selectTagOnly(tag: string): void {
    this._selectedType.set(null);
    this._selectedTags.set([tag]);
  }

  toggleTag(tag: string): void {
    const current = this._selectedTags();
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    this._selectedTags.set(updated);
  }

  setMonth(month: string | null): void {
    this._selectedMonth.set(month);
  }

  toggleMonth(month: string): void {
    this.setMonth(this._selectedMonth() === month ? null : month);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  clearFilters(): void {
    this._selectedType.set(null);
    this._selectedTags.set([]);
    this._selectedMonth.set(null);
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