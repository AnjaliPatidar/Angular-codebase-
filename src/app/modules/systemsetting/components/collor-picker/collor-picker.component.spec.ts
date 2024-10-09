import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollorPickerComponent } from './collor-picker.component';

describe('CollorPickerComponent', () => {
  let component: CollorPickerComponent;
  let fixture: ComponentFixture<CollorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollorPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
