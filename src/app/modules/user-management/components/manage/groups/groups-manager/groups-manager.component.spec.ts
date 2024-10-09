import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsManagerComponent } from './groups-manager.component';

describe('GroupsManagerComponent', () => {
  let component: GroupsManagerComponent;
  let fixture: ComponentFixture<GroupsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
