import { TestBed } from '@angular/core/testing';

import { MainDataOperationService } from './main-data-operation.service';

describe('MainDataOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainDataOperationService = TestBed.get(MainDataOperationService);
    expect(service).toBeTruthy();
  });
});
