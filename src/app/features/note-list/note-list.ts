import { Component, inject, computed, OnInit, HostListener, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge';
import { TagBadgeComponent } from '../../shared/components/tag-badge/tag-badge';
import { SidebarComponent } from '../sidebar/sidebar';
import { Note, NoteType } from '../../shared/models/note';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card';

const NOTE_TYPES = [
  { key: 'acronym' as NoteType, label: 'Acronym' },
  { key: 'concept' as NoteType, label: 'Concept' },
  { key: 'definition' as NoteType, label: 'Definition' },
  { key: 'tip' as NoteType, label: 'Tip' },
  { key: 'pattern' as NoteType, label: 'Pattern' },
];

@Component({
  selector: 'note-list',
  standalone: true,
  imports: [CommonModule, TypeBadgeComponent, TagBadgeComponent, SidebarComponent, SkeletonCardComponent],
  templateUrl: './note-list.html',
  styleUrl: './note-list.scss'
})
export class NoteListComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notesService = inject(NotesService);

  readonly notes = this.notesService.filteredNotes;
  readonly selectedType = this.notesService.selectedType;
  readonly selectedTags = this.notesService.selectedTags;
  readonly allTags = this.notesService.allTags;
  readonly loading = this.notesService.loading;
  readonly noteTypes = NOTE_TYPES;
  readonly tagsExpanded = signal(false);

  readonly breadcrumbType = computed(() => {
    const type = this.selectedType();
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : null;
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap.get('query');
    if (q) this.notesService.setSearchQuery(q);
  }

  onSelectType(type: NoteType | null): void {
    this.notesService.setType(type);
  }

  onToggleTag(tag: string): void {
    this.notesService.toggleTag(tag);
  }

  onNoteClick(note: Note): void {
    this.router.navigate(['/notes', note.id]);
  }


  toggleTags(): void {
    this.tagsExpanded.update(v => !v);
  }

  getPreview(content: string): string {
    return content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\n/g, ' ')
      .trim()
      .slice(0, 100) + '...';
  }
}