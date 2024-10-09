import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmaionmodalComponent } from './confirmaionmodal.component';

describe('ConfirmaionmodalComponent', () => {
  let component: ConfirmaionmodalComponent;
  let fixture: ComponentFixture<ConfirmaionmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmaionmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmaionmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
