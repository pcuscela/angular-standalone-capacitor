import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

export interface IConfiguration {
	production: boolean;
	apiUrl: string;
	buildNumber: number;
	sentryDsn: string;
	openTelemetryApiUrl: string;
	openTelemetryServiceName: string;
	openTelemetryAttributes: string;
	destinatatrioInvioEmailSegnalazioniErrore: string;
	oggettoInvioEmailSegnalazioniErrore: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
	protected _configuration!: IConfiguration;

	constructor() {}

	get configuration(): IConfiguration {
		return this._configuration;
	}

	load(http: HttpClient) {
		return http.get('assets/environment/environment.json').pipe(
			map((response: any) => {
				this._configuration = response as IConfiguration;
				return this.configuration;
			}),
		);
	}
}
