import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteLink } from './note-link';

describe('NoteLink', () => {
  let component: NoteLink;
  let fixture: ComponentFixture<NoteLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteLink],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
