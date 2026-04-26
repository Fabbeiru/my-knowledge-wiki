import { Component, inject, signal, computed, HostListener, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../core/services/notes';
import { Note } from '../../models/note';

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBarComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notesService = inject(NotesService);
  private el = inject(ElementRef);

  readonly query = signal('');
  readonly showDropdown = signal(false);

  readonly suggestions = computed(() => {
    const q = this.query().toLowerCase().trim();
    if (q.length < 3) return [];

    // Buscamos en TODAS las notas, no en las filtradas
    return this.notesService.allNotes()
      .filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q)) ||
        n.content.toLowerCase().includes(q)
      )
      .slice(0, 6);
  });

  ngOnInit(): void {
    // Leer query param inicial al cargar
    const query = this.route.snapshot.queryParamMap.get('query');
    if (query) {
      this.query.set(query);
      this.notesService.setSearchQuery(query);
    }
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.updateUrl(value);
    this.showDropdown.set(value.length >= 3);

    // Si borramos todo limpiamos también el servicio
    if (value.length === 0) {
      this.notesService.setSearchQuery('');
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.search();
    if (event.key === 'Escape') this.closeDropdown();
  }

  search(): void {
    const query = this.query().trim();
    this.notesService.setSearchQuery(query);
    this.closeDropdown();
    this.router.navigate(['/notes'], {
      queryParams: query ? { query } : {},
      queryParamsHandling: 'merge'
    });
  }

  focusInput(): void {
    this.el.nativeElement.querySelector('input')?.focus();
  }

  goToNote(note: Note): void {
    this.closeDropdown();
    this.query.set('');
    this.updateUrl('');
    this.router.navigate(['/notes', note.id]);
  }

  clearSearch(): void {
    this.query.set('');
    this.updateUrl('');
    this.notesService.setSearchQuery('');
    this.closeDropdown();
  }

  closeDropdown(): void {
    this.showDropdown.set(false);
  }

  private updateUrl(value: string): void {
    const isNotesRoute = this.router.url.startsWith('/notes') &&
      !this.router.url.includes('/notes/');
    if (!isNotesRoute) return;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: value.length > 0 ? { query: value } : {},
      queryParamsHandling: 'replace', // replace en lugar de merge para limpiar bien
      replaceUrl: true
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}