import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailInfoComponent } from './case-detail-info.component';

describe('CaseDetailInfoComponent', () => {
  let component: CaseDetailInfoComponent;
  let fixture: ComponentFixture<CaseDetailInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDetailInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
