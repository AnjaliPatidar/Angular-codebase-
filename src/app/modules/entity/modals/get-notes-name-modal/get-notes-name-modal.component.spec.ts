import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetNotesNameModalComponent } from './get-notes-name-modal.component';

describe('GetNotesNameModalComponent', () => {
  let component: GetNotesNameModalComponent;
  let fixture: ComponentFixture<GetNotesNameModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetNotesNameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetNotesNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
