import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailIconsComponent } from './case-detail-icons.component';

describe('CaseDetailIconsComponent', () => {
  let component: CaseDetailIconsComponent;
  let fixture: ComponentFixture<CaseDetailIconsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDetailIconsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
