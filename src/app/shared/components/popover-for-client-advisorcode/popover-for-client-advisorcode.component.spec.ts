import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverForClientAdvisorcodeComponent } from './popover-for-client-advisorcode.component';

describe('PopoverForClientAdvisorcodeComponent', () => {
  let component: PopoverForClientAdvisorcodeComponent;
  let fixture: ComponentFixture<PopoverForClientAdvisorcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverForClientAdvisorcodeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverForClientAdvisorcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
