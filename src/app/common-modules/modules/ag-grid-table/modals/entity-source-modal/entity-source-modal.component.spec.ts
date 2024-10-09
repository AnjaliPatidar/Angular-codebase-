import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitySourceModalComponent } from './entity-source-modal.component';

describe('EntitySourceModalComponent', () => {
  let component: EntitySourceModalComponent;
  let fixture: ComponentFixture<EntitySourceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitySourceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitySourceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
