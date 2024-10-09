import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialmediaRightpanelComponent } from './socialmedia-rightpanel.component';

describe('SocialmediaRightpanelComponent', () => {
  let component: SocialmediaRightpanelComponent;
  let fixture: ComponentFixture<SocialmediaRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialmediaRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialmediaRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
