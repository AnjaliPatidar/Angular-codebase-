import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyCompaniesComponent } from './nearby-companies.component';

describe('NearbyCompaniesComponent', () => {
  let component: NearbyCompaniesComponent;
  let fixture: ComponentFixture<NearbyCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbyCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearbyCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
