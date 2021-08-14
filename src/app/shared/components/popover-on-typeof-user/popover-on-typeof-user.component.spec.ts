import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverOnTypeofUserComponent } from './popover-on-typeof-user.component';

describe('PopoverOnTypeofUserComponent', () => {
  let component: PopoverOnTypeofUserComponent;
  let fixture: ComponentFixture<PopoverOnTypeofUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverOnTypeofUserComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverOnTypeofUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
