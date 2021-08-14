import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectImagesforPdfuploadComponent } from './select-imagesfor-pdfupload.component';

describe('SelectImagesforPdfuploadComponent', () => {
  let component: SelectImagesforPdfuploadComponent;
  let fixture: ComponentFixture<SelectImagesforPdfuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectImagesforPdfuploadComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectImagesforPdfuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
