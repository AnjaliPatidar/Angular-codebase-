import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCaseManagementComponent } from './create-case-management.component';

describe('CreateCaseManagementComponent', () => {
  let component: CreateCaseManagementComponent;
  let fixture: ComponentFixture<CreateCaseManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCaseManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCaseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
