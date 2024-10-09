import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesAssignedUsersComponent } from './roles-assigned-users.component';

describe('RolesAssignedUsersComponent', () => {
  let component: RolesAssignedUsersComponent;
  let fixture: ComponentFixture<RolesAssignedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesAssignedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesAssignedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
