import { Routes } from '@angular/router';
import { NoteListComponent } from './features/note-list/note-list';
import { NoteDetailComponent } from './features/note-detail/note-detail';
import { NotFoundComponent } from './features/not-found/not-found';

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
    path: 'notes/:id',
    component: NoteDetailComponent
    //loadComponent: () => import('./features/note-detail/note-detail').then(m => m.NoteDetailComponent)
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];