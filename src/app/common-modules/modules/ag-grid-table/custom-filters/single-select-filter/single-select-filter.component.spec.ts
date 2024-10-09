import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectFilterComponent } from './single-select-filter.component';

describe('SingleSelectFilterComponent', () => {
  let component: SingleSelectFilterComponent;
  let fixture: ComponentFixture<SingleSelectFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleSelectFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
