import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaRightpanelComponent } from './media-rightpanel.component';

describe('MediaRightpanelComponent', () => {
  let component: MediaRightpanelComponent;
  let fixture: ComponentFixture<MediaRightpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaRightpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaRightpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
