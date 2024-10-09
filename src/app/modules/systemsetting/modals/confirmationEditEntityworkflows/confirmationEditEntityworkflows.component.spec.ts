import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationEditEntityworkflowsComponent } from './confirmationEditEntityworkflows.component';

describe('ConfirmationEditEntityworkflowsComponent', () => {
  let component: ConfirmationEditEntityworkflowsComponent;
  let fixture: ComponentFixture<ConfirmationEditEntityworkflowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationEditEntityworkflowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationEditEntityworkflowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
