import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMetadataComponent } from './alert-metadata.component';

describe('AlertMetadataComponent', () => {
  let component: AlertMetadataComponent;
  let fixture: ComponentFixture<AlertMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
