import { Routes } from '@angular/router';
import { LoginComponent } from '../public/login/login.component';
import { Pagina404Component } from '../public/pagina404/pagina404.component';
import { PublicComponent } from '../public/public.component';
import { PrivateComponent } from './private.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
	{
		path: '',
		component: PrivateComponent,
		children: [{ path: '', component: HomepageComponent }],
	},
];
