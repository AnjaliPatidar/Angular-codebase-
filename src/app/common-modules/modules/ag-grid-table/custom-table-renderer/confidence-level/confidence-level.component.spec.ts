import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfidenceLevelComponent } from './confidence-level.component';

describe('ConfidenceLevelComponent', () => {
  let component: ConfidenceLevelComponent;
  let fixture: ComponentFixture<ConfidenceLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfidenceLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfidenceLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
