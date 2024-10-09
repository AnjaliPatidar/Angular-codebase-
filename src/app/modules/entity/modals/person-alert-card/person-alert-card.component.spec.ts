import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAlertCardComponent } from './person-alert-card.component';

describe('PersonAlertCardComponent', () => {
  let component: PersonAlertCardComponent;
  let fixture: ComponentFixture<PersonAlertCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAlertCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAlertCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
