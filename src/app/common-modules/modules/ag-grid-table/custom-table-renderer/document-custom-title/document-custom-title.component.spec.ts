import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCustomTitleComponent } from './document-custom-title.component';

describe('DocumentCustomTitleComponent', () => {
  let component: DocumentCustomTitleComponent;
  let fixture: ComponentFixture<DocumentCustomTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentCustomTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCustomTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
