import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const token = localStorage.getItem('token');

	if (token) {
		// Autenticazione in header
		const headers = new HttpHeaders({ Authorization: token });
		req = req.clone({ headers });
	}

	return next(req);
};
