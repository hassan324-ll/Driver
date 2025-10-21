import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceDocs } from './compliance-docs';

describe('ComplianceDocs', () => {
  let component: ComplianceDocs;
  let fixture: ComponentFixture<ComplianceDocs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceDocs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceDocs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
