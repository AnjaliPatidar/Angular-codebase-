import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertWatchlistInfoComponent } from './alert-watchlist-info.component';

describe('AlertWatchlistInfoComponent', () => {
  let component: AlertWatchlistInfoComponent;
  let fixture: ComponentFixture<AlertWatchlistInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertWatchlistInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertWatchlistInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
