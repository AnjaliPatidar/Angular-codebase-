import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsCollapsedContainerComponent } from './widgets-collapsed-container.component';

describe('WidgetsCollapsedContainerComponent', () => {
  let component: WidgetsCollapsedContainerComponent;
  let fixture: ComponentFixture<WidgetsCollapsedContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsCollapsedContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsCollapsedContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
