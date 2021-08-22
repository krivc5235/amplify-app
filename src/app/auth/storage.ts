import { InjectionToken } from '@angular/core';

export const INJ_TOKEN = new InjectionToken<Storage>(
  'Shramba brskalnika',
  {
    providedIn: 'root',
    factory: () => localStorage
  }
);