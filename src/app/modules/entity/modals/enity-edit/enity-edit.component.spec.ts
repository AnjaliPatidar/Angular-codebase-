import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnityEditComponent } from './enity-edit.component';

describe('EnityEditComponent', () => {
  let component: EnityEditComponent;
  let fixture: ComponentFixture<EnityEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnityEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
