import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesSettingsComponent } from './roles-settings.component';

describe('RolesSettingsComponent', () => {
  let component: RolesSettingsComponent;
  let fixture: ComponentFixture<RolesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
