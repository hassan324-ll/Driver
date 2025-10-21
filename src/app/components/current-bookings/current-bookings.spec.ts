import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBookings } from './current-bookings';

describe('CurrentBookings', () => {
  let component: CurrentBookings;
  let fixture: ComponentFixture<CurrentBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentBookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
