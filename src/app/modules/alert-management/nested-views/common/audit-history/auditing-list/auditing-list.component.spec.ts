import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditingListComponent } from './auditing-list.component';

describe('AuditingListComponent', () => {
  let component: AuditingListComponent;
  let fixture: ComponentFixture<AuditingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
