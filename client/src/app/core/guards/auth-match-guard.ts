import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const authMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn();
};
