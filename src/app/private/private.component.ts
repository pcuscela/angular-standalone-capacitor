import { Component } from '@angular/core';

import { HeaderComponent } from '../private/layout/header/header.component';
import { FooterComponent } from '../private/layout/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-private',
	standalone: true,
	imports: [RouterOutlet, HeaderComponent, FooterComponent],
	template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
	styles: ``,
})
export class PrivateComponent {}
