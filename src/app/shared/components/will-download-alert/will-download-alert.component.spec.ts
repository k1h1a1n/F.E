import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WillDownloadAlertComponent } from './will-download-alert.component';

describe('WillDownloadAlertComponent', () => {
  let component: WillDownloadAlertComponent;
  let fixture: ComponentFixture<WillDownloadAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WillDownloadAlertComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WillDownloadAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
