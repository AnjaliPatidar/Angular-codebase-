import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertAdverseMediaComponent } from './alert-adverse-media.component';

describe('AlertAdverseMediaComponent', () => {
  let component: AlertAdverseMediaComponent;
  let fixture: ComponentFixture<AlertAdverseMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertAdverseMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertAdverseMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
