import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableRendererComponent } from './user-table-renderer.component';

describe('UserTableRendererComponent', () => {
  let component: UserTableRendererComponent;
  let fixture: ComponentFixture<UserTableRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTableRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTableRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
