import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntitysourceevidenceComponent } from './entitysourceevidence.component';

describe('EntitysourceevidenceComponent', () => {
  let component: EntitysourceevidenceComponent;
  let fixture: ComponentFixture<EntitysourceevidenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntitysourceevidenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntitysourceevidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
