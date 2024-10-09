import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLocationMapComponent } from './home-location-map.component';

describe('HomeLocationMapComponent', () => {
  let component: HomeLocationMapComponent;
  let fixture: ComponentFixture<HomeLocationMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLocationMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
