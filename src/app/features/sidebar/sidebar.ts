import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotesService } from '../../core/services/notes';
import { NoteType } from '../../shared/models/note';

const TYPE_CONFIG: Record<NoteType, { label: string; color: string }> = {
  acronym: { label: 'Acronym', color: '#185FA5' },
  concept: { label: 'Concept', color: '#534AB7' },
  definition: { label: 'Definition', color: '#0F6E56' },
  tip: { label: 'Tip', color: '#854F0B' },
  pattern: { label: 'Pattern', color: '#993C1D' },
};

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  private notesService = inject(NotesService);

  readonly selectedType = this.notesService.selectedType;
  readonly selectedTags = this.notesService.selectedTags;
  readonly allTags = this.notesService.allTags;
  readonly countByType = this.notesService.notesCountByType;

  readonly totalNotes = computed(() =>
    Object.values(this.countByType()).reduce((a, b) => a + b, 0)
  );

  readonly types = Object.entries(TYPE_CONFIG) as [NoteType, { label: string; color: string }][];

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
}