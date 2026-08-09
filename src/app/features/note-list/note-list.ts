import { Component, inject, computed, OnInit, HostListener, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NotesService } from '../../core/services/notes';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge';
import { TagBadgeComponent } from '../../shared/components/tag-badge/tag-badge';
import { SidebarComponent } from '../sidebar/sidebar';
import { Note, NoteType } from '../../shared/models/note';
import { SkeletonCardComponent } from '../../shared/components/skeleton-card/skeleton-card';

const NOTE_TYPES = [
  { key: 'acronym' as NoteType, label: 'Acronym', color: '#185FA5' },
  { key: 'concept' as NoteType, label: 'Concept', color: '#534AB7' },
  { key: 'definition' as NoteType, label: 'Definition', color: '#0F6E56' },
  { key: 'tip' as NoteType, label: 'Tip', color: '#854F0B' },
  { key: 'pattern' as NoteType, label: 'Pattern', color: '#993C1D' },
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
  private titleService = inject(Title);

  readonly notes = this.notesService.filteredNotes;
  readonly selectedType = this.notesService.selectedType;
  readonly selectedTags = this.notesService.selectedTags;
  readonly selectedMonth = this.notesService.selectedMonth;
  readonly allTags = this.notesService.allTags;
  readonly allMonths = this.notesService.allMonths;
  readonly countByType = this.notesService.notesCountByType;
  readonly loading = this.notesService.loading;
  readonly noteTypes = NOTE_TYPES;
  readonly filtersSheetOpen = signal(false);

  readonly breadcrumbType = computed(() => {
    const type = this.selectedType();
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : null;
  });

  readonly activeFilterCount = computed(() =>
    (this.selectedType() ? 1 : 0) + this.selectedTags().length + (this.selectedMonth() ? 1 : 0)
  );

  ngOnInit(): void {
    this.titleService.setTitle('MyKnowledgeWiki');
    const q = this.route.snapshot.queryParamMap.get('query');
    if (q) this.notesService.setSearchQuery(q);
  }

  onSelectType(type: NoteType | null): void {
    if (type === null) {
      this.notesService.setType(null);
    } else {
      this.notesService.toggleType(type);
    }
  }

  onToggleTag(tag: string): void {
    this.notesService.toggleTag(tag);
  }

  onToggleMonth(month: string): void {
    this.notesService.toggleMonth(month);
  }

  onNoteClick(note: Note): void {
    this.router.navigate(['/notes', note.id]);
  }


  openFiltersSheet(): void {
    this.filtersSheetOpen.set(true);
  }

  closeFiltersSheet(): void {
    this.filtersSheetOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeFiltersSheet();
  }

  onClearFilters(): void {
    this.notesService.setType(null);
    this.notesService.setMonth(null);
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