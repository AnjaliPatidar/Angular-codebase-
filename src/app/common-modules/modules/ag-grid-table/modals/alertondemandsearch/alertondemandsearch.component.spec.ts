import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertondemandsearchComponent } from './alertondemandsearch.component';

describe('AlertondemandsearchComponent', () => {
  let component: AlertondemandsearchComponent;
  let fixture: ComponentFixture<AlertondemandsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertondemandsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertondemandsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
