import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterOTPandDecryptFileComponent } from './enter-otpand-decrypt-file.component';

describe('EnterOTPandDecryptFileComponent', () => {
  let component: EnterOTPandDecryptFileComponent;
  let fixture: ComponentFixture<EnterOTPandDecryptFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterOTPandDecryptFileComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterOTPandDecryptFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
