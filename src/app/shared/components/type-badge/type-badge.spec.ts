import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeBadge } from './type-badge';

describe('TypeBadge', () => {
  let component: TypeBadge;
  let fixture: ComponentFixture<TypeBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeBadge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
