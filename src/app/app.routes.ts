import { Routes } from '@angular/router';
import { NoteListComponent } from './features/note-list/note-list';
import { NoteDetailComponent } from './features/note-detail/note-detail';
import { NotFoundComponent } from './features/not-found/not-found';
import { TagsComponent } from './features/tags/tags';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },
  {
    path: 'notes',
    component: NoteListComponent
    //loadComponent: () => import('./features/note-list/note-list').then(m => m.NoteListComponent)
  },
  {
    path: 'tags',
    component: TagsComponent
  },
  {
    path: 'notes/:id',
    component: NoteDetailComponent
    //loadComponent: () => import('./features/note-detail/note-detail').then(m => m.NoteDetailComponent)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];