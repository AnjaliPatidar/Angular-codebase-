import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimizedPopModalComponent } from './minimized-pop-modal.component';

describe('MinimizedPopModalComponent', () => {
  let component: MinimizedPopModalComponent;
  let fixture: ComponentFixture<MinimizedPopModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimizedPopModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimizedPopModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
