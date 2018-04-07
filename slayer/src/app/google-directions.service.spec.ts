import { TestBed, inject } from '@angular/core/testing';

import { GoogleDirectionsService } from './google-directions.service';

describe('GoogleDirectionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleDirectionsService]
    });
  });

  it('should be created', inject([GoogleDirectionsService], (service: GoogleDirectionsService) => {
    expect(service).toBeTruthy();
  }));
});
