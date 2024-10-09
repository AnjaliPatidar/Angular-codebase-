import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleRenderComponent } from './toggle-render.component';

describe('ToggleRenderComponent', () => {
  let component: ToggleRenderComponent;
  let fixture: ComponentFixture<ToggleRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
