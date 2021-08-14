import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WillDisclaimerComponent } from './enter-file-download-otp.component';

describe('WillDisclaimerComponent', () => {
  let component: WillDisclaimerComponent;
  let fixture: ComponentFixture<WillDisclaimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WillDisclaimerComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WillDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
