import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationMapComponent } from './relation-map.component';

describe('RelationMapComponent', () => {
  let component: RelationMapComponent;
  let fixture: ComponentFixture<RelationMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
