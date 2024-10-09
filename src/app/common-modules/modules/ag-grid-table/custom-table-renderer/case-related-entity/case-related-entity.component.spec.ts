import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRelatedEntityComponent } from './case-related-entity.component';

describe('CaseRelatedEntityComponent', () => {
  let component: CaseRelatedEntityComponent;
  let fixture: ComponentFixture<CaseRelatedEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseRelatedEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRelatedEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
