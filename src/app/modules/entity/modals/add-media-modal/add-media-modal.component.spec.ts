import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMediaModalComponent } from './add-media-modal.component';

describe('AddMediaModalComponent', () => {
  let component: AddMediaModalComponent;
  let fixture: ComponentFixture<AddMediaModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMediaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMediaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
