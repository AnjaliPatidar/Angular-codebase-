import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAnalysisComponent } from './form-analysis.component';

describe('FormAnalysisComponent', () => {
  let component: FormAnalysisComponent;
  let fixture: ComponentFixture<FormAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
