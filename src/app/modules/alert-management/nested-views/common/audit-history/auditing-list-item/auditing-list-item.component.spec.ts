import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditingListItemComponent } from './auditing-list-item.component';

describe('AuditingListItemComponent', () => {
  let component: AuditingListItemComponent;
  let fixture: ComponentFixture<AuditingListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditingListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditingListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
