import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOtpPage } from './verify-otp.page';

describe('VerifyOtpPage', () => {
  let component: VerifyOtpPage;
  let fixture: ComponentFixture<VerifyOtpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyOtpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
