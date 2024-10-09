import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsAssignedUsersComponent } from './groups-assigned-users.component';

describe('GroupsAssignedUsersComponent', () => {
  let component: GroupsAssignedUsersComponent;
  let fixture: ComponentFixture<GroupsAssignedUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsAssignedUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsAssignedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
