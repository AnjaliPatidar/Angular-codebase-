import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityClipboardComponent } from './entity-clipboard.component';

describe('EntityClipboardComponent', () => {
  let component: EntityClipboardComponent;
  let fixture: ComponentFixture<EntityClipboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityClipboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityClipboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
