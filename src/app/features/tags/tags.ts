import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../core/services/notes';

@Component({
  selector: 'tags-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tags.html',
  styleUrl: './tags.scss'
})
export class TagsComponent {
  private router = inject(Router);
  private notesService = inject(NotesService);

  readonly tags = this.notesService.allTagsWithCounts;

  readonly maxCount = computed(() =>
    this.tags().reduce((max, t) => Math.max(max, t.count), 1)
  );

  fontSizeFor(count: number): string {
    const ratio = count / this.maxCount();
    return `${13 + ratio * 11}px`;
  }

  onSelectTag(tag: string): void {
    this.notesService.selectTagOnly(tag);
    this.router.navigate(['/notes']);
  }

  goBack(): void {
    this.router.navigate(['/notes']);
  }
}
