import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedRecordsActionsComponent } from './associated-records-actions.component';

describe('AssociatedRecordsActionsComponent', () => {
  let component: AssociatedRecordsActionsComponent;
  let fixture: ComponentFixture<AssociatedRecordsActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociatedRecordsActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociatedRecordsActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
