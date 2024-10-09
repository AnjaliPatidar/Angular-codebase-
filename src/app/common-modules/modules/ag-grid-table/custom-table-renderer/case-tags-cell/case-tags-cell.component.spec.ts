import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTagsCellComponent } from './case-tags-cell.component';

describe('CaseTagsCellComponent', () => {
  let component: CaseTagsCellComponent;
  let fixture: ComponentFixture<CaseTagsCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseTagsCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseTagsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
