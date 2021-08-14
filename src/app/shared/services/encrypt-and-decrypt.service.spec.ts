import { TestBed } from '@angular/core/testing';

import { EncryptAndDecryptService } from './encrypt-and-decrypt.service';

describe('EncryptAndDecryptService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncryptAndDecryptService = TestBed.get(EncryptAndDecryptService);
    expect(service).toBeTruthy();
  });
});
