import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './private/layout/header/header.component';
import { FooterComponent } from './private/layout/footer/footer.component';
import { BlockUI, BlockUIComponent, BlockUIModule } from 'ng-block-ui';
import { LogService } from './shared/_services/log.service';
import { TranslateService } from '@ngx-translate/core';
import * as Sentry from '@sentry/angular';
import { ConfigService } from './shared/_services/config.service';
import { OpenTelemetryService } from './shared/_services/open-telemetry.service';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [BlockUIModule, RouterOutlet, HeaderComponent, FooterComponent],
	template: `
    <block-ui>
      <router-outlet></router-outlet>
    </block-ui>
  `,
	styles: [],
})
export class AppComponent {
	constructor(config: ConfigService, translateService: TranslateService, openTelemetryService: OpenTelemetryService) {
		// Configurazione traduzioni
		translateService.setDefaultLang('it');
		translateService.use('it');

		console.log(JSON.stringify(config.configuration));
		// Configurazione Sentry
		if (config.configuration.production) {
			console.log('Inizializazione Sentry...');
			Sentry.init({
				dsn: config.configuration.sentryDsn,
				integrations: [],
				release: `RELEASE_${config.configuration.buildNumber}`,
			});
		}

		// Configurazione OpenTelemetry
		if (config.configuration.production) {
			console.log('Inizializazione OpenTelemetry...');
			const openTelemetryOptions = {
				apiUrl: config.configuration.openTelemetryApiUrl,
				serviceName: config.configuration.openTelemetryServiceName,
				attributes: config.configuration.openTelemetryAttributes,
				trace: true,
				log: true,
			};
			openTelemetryService.inizializza(openTelemetryOptions);
			const { utente } = JSON.parse(localStorage['user'] || '{}');
			openTelemetryService.attributiFissi.idUtente = utente ? String(utente.idUtente) : '';
			openTelemetryService.attributiFissi.emailUtente = utente ? utente.email : '';
			openTelemetryService.attributiFissi.nomeUtente = utente ? `${utente.nome} ${utente.cognome}` : '';
			openTelemetryService.abilitaLoggingPagineVisitate();
		}
	}
}
