import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextRendererComponent } from './input-text-renderer.component';

describe('InputTextRendererComponent', () => {
  let component: InputTextRendererComponent;
  let fixture: ComponentFixture<InputTextRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTextRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTextRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
