import { authInterceptor } from './interceptor';
import { HttpRequest } from '@angular/common/http';

describe('authInterceptor', () => {
  it('should be defined', () => {
    expect(authInterceptor).toBeTruthy();
  });
});
