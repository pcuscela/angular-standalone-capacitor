import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
import { tokenInterceptor } from './shared/_interceptors/token.interceptor';
import { httpLogInterceptor } from './shared/_interceptors/http-log.interceptor';
import { errorInterceptor } from './shared/_interceptors/error.interceptor';
import { ConfigService } from './shared/_services/config.service';
import * as Sentry from '@sentry/angular';

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Configura tutte le richieste che non devono essere bloccate da BlockUI
export function filtroBlockUI(req: HttpRequest<any>): boolean {
	if (req.url.includes('noBlock')) {
		return true;
	}
	return false;
}

export function configServiceFactory(http: HttpClient, configService: ConfigService) {
	return () => configService.load(http);
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(withInterceptors([tokenInterceptor, httpLogInterceptor, errorInterceptor])),
		{
			provide: APP_INITIALIZER,
			useFactory: configServiceFactory,
			deps: [HttpClient, ConfigService],
			multi: true,
		},
		{
			provide: ErrorHandler,
			useValue: Sentry.createErrorHandler({
				showDialog: false,
			}),
		},
		importProvidersFrom(
			TranslateModule.forRoot({
				loader: {
					provide: TranslateLoader,
					useFactory: createTranslateLoader,
					deps: [HttpClient],
				},
			}),
			BlockUIModule.forRoot(),
			BlockUIHttpModule.forRoot({
				requestFilters: [filtroBlockUI],
			}),
		),
	],
};
