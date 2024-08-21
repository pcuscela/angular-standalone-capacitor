import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
	const authService = inject(AuthService);
	const router = inject(Router);
	if (authService.isAuthenticated) {
		return true;
	} else {
		router.navigate(['/public/login']);
		return false;
	}
};
