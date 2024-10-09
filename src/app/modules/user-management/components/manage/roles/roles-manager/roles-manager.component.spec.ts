import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesManagerComponent } from './roles-manager.component';

describe('RolesManagerComponent', () => {
  let component: RolesManagerComponent;
  let fixture: ComponentFixture<RolesManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
