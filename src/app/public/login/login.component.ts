import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/_services/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './login.component.html',
	styles: ``,
})
export class LoginComponent {
	username: string = '';
	password: string = '';

	constructor(
		private router: Router,
		private authService: AuthService,
	) {}

	login() {
		this.authService.login(this.username, this.password).subscribe((data) => {
			if (data) {
				this.router.navigate(['/']);
			} else {
				console.error('La chiamata di login ha risposto senza dati');
			}
		});
	}
}
