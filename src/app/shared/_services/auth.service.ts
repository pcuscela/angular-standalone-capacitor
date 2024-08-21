import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
	constructor(
		private http: HttpClient,
		private router: Router,
	) {}

	get isAuthenticated() {
		const token = localStorage.getItem('token');
		return !!token;
	}

	login(username: string, password: string) {
		console.log('Login');
		return of({ username: 'Utente', token: '123456' }).pipe(
			tap((data) => {
				localStorage.setItem('token', data.token);
			}),
		);
		// return this.http.post('/api/login', { username, password });
	}

	logout() {
		localStorage.clear();
		sessionStorage.clear();
		this.router.navigate(['/public/login']);
	}

	checkToken() {
		return this.http.get('/api/check-token');
	}
}
