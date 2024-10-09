import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFooterModalComponent } from './report-footer-modal.component';

describe('ReportFooterModalComponent', () => {
  let component: ReportFooterModalComponent;
  let fixture: ComponentFixture<ReportFooterModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportFooterModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFooterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
