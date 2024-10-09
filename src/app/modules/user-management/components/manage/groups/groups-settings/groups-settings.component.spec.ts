import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsSettingsComponent } from './groups-settings.component';

describe('GroupsSettingsComponent', () => {
  let component: GroupsSettingsComponent;
  let fixture: ComponentFixture<GroupsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
