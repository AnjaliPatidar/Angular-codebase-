import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarCompaniesComponent } from './similar-companies.component';

describe('SimilarCompaniesComponent', () => {
  let component: SimilarCompaniesComponent;
  let fixture: ComponentFixture<SimilarCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
