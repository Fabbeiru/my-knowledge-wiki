import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonDetail } from './skeleton-detail';

describe('SkeletonDetail', () => {
  let component: SkeletonDetail;
  let fixture: ComponentFixture<SkeletonDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
