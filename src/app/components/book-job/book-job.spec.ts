import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookJob } from './book-job';

describe('BookJob', () => {
  let component: BookJob;
  let fixture: ComponentFixture<BookJob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookJob]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookJob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
