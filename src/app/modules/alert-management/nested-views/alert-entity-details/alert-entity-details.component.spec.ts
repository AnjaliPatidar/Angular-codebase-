import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertEntityDetailsComponent } from './alert-entity-details.component';

describe('AlertEntityDetailsComponent', () => {
  let component: AlertEntityDetailsComponent;
  let fixture: ComponentFixture<AlertEntityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertEntityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertEntityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
