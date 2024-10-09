import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRelatedEntityCountryComponent } from './case-related-entity-country.component';

describe('CaseRelatedEntityCountryComponent', () => {
  let component: CaseRelatedEntityCountryComponent;
  let fixture: ComponentFixture<CaseRelatedEntityCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseRelatedEntityCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseRelatedEntityCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
