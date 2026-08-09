import { Component, inject, computed, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotesService } from '../../core/services/notes';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge';
import { TagBadgeComponent } from '../../shared/components/tag-badge/tag-badge';
import { MarkdownRendererComponent, MarkdownHeading } from '../../shared/components/markdown-renderer/markdown-renderer';
import { Note, NoteType } from '../../shared/models/note';
import { SkeletonDetailComponent } from '../../shared/components/skeleton-detail/skeleton-detail';

@Component({
  selector: 'note-detail',
  standalone: true,
  imports: [CommonModule, TypeBadgeComponent, TagBadgeComponent, MarkdownRendererComponent, SkeletonDetailComponent],
  templateUrl: './note-detail.html',
  styleUrl: './note-detail.scss'
})
export class NoteDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notesService = inject(NotesService);
  private titleService = inject(Title);

  // Convertimos los params del router a signal para que sea reactivo
  private readonly params = toSignal(this.route.paramMap);

  readonly note = computed(() => {
    const id = this.params()?.get('id');
    return id ? this.notesService.getNoteById(id) : undefined;
  });

  // Título de la pestaña: "Nombre de la nota - MyKnowledgeWiki".
  // Al depender de note() se reevalúa también cuando cambiamos de nota
  // sin salir del componente (p. ej. desde "Relacionadas").
  private readonly titleEffect = effect(() => {
    const note = this.note();
    if (note) this.titleService.setTitle(`${note.title} - MyKnowledgeWiki`);
  });

  readonly relatedNotes = computed(() => {
    const note = this.note();
    if (!note) return [];
    return note.related
      .map(id => this.notesService.getNoteById(id))
      .filter((n): n is Note => n !== undefined);
  });

  readonly isLoading = computed(() => {
    const id = this.params()?.get('id');
    return this.notesService.loading() || (!!id && this.note() === undefined);
  });

  readonly headings = signal<MarkdownHeading[]>([]);

  onHeadingsChange(headings: MarkdownHeading[]): void {
    this.headings.set(headings);
  }

  scrollToHeading(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goBack(): void {
    this.router.navigate(['/notes']);
  }

  goToNote(id: string): void {
    this.router.navigate(['/notes', id]);
  }

  goToType(type: NoteType): void {
    this.notesService.setType(type);
    this.router.navigate(['/notes']);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
}