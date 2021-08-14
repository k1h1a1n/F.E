import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverForAdvisorVerificationComponent } from './popover-for-advisor-verification.component';

describe('PopoverForAdvisorVerificationComponent', () => {
  let component: PopoverForAdvisorVerificationComponent;
  let fixture: ComponentFixture<PopoverForAdvisorVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverForAdvisorVerificationComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverForAdvisorVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
