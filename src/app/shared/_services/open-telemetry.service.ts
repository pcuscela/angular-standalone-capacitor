import { Injectable } from '@angular/core';
import { BatchSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import { Logger, SeverityNumber } from '@opentelemetry/api-logs';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

export interface IOpenTelemetryOptions {
	apiUrl: string;
	serviceName: string;
	attributes: string;
	trace: boolean;
	log: boolean;
}

@Injectable({ providedIn: 'root' })
export class OpenTelemetryService {
	protected routerEventSubscription?: Subscription;

	logger?: Logger;

	/**
	 * Gli attributo che vengono inviati in automatico con ogni log
	 */
	attributiFissi: any = {};

	constructor(private router: Router) {}

	inizializza(options: IOpenTelemetryOptions) {
		const attributes = {
			'service.name': options.serviceName,
			'resources.attributes': options.attributes,
		};

		if (options.trace) {
			this.registraProviderTrace(options.apiUrl, attributes);
		}

		if (options.log) {
			this.registraProviderLog(options.apiUrl, attributes);
		}

		// Registering instrumentations
		registerInstrumentations({
			instrumentations: [
				new XMLHttpRequestInstrumentation({
					applyCustomAttributesOnSpan: (span) => span.setAttributes(this.attributiFissi),
				}),
			],
		});
	}

	/**
	 * Invia un log tramite opentelemetry
	 * @param attributes Una lista di tag associati al record utili per filtri e statistiche, es: { action: 'ricerca-eseguita', tenant: 'a3fv' }
	 * @param body Il messaggio visualizzato come testo del log, es: 'Ricerca eseguita'
	 */
	log(attributes: any, body: string) {
		const severityNumber = SeverityNumber.INFO;
		const severityText = 'INFO';
		if (this.logger) {
			this.logger.emit({
				severityNumber,
				severityText,
				attributes: {
					...this.attributiFissi,
					...attributes,
				},
				body,
			});
		}
	}

	abilitaLoggingPagineVisitate() {
		if (this.routerEventSubscription && !this.routerEventSubscription.closed) {
			this.routerEventSubscription.unsubscribe();
		}
		this.routerEventSubscription = this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd) {
				this.log({ action: 'pagina-visitata', urlPagina: event.url }, `Pagina visitata: ${event.url}`);
			}
		});
	}

	protected registraProviderTrace(apiUrl: string, attributes: any) {
		const provider = new WebTracerProvider({
			resource: {
				attributes,
				merge: (resource) => resource!,
			},
		});

		const processor = new BatchSpanProcessor(
			new OTLPTraceExporter({
				url: `${apiUrl}/v1/traces`,
				headers: {},
			}),
		);
		provider.addSpanProcessor(processor);

		provider.register({
			contextManager: new ZoneContextManager(),
		});
	}

	protected registraProviderLog(apiUrl: string, attributes: any) {
		const provider = new LoggerProvider({
			resource: {
				attributes,
				merge: (resource) => resource!,
			},
		});

		const processor = new BatchLogRecordProcessor(
			new OTLPLogExporter({
				url: `${apiUrl}/v1/logs`,
				headers: {}, // an optional object containing custom headers to be sent with each request
				concurrencyLimit: 1, // an optional limit on pending requests
			}),
		);
		provider.addLogRecordProcessor(processor);
		this.logger = provider.getLogger('default', '1.0.0');
	}
}

/*
class PageChangeIntrumentation extends InstrumentationBase {
	protected override init(): void | InstrumentationModuleDefinition | InstrumentationModuleDefinition[] {
		const definition: InstrumentationModuleDefinition = {
			name: 'page-change',
			supportedVersions: ['1.x'],
			files: [],
		};
		return definition;
	}

	protected router: Router;
	protected routerEventSubscription?: Subscription;
	protected applyCustomAttributesOnSpan?: (span: any) => void;

	constructor(router: Router, config: { applyCustomAttributesOnSpan?: (span: any) => void } = {}) {
		super('page-change', '1', { ...config, enabled: false });
		if (config.applyCustomAttributesOnSpan) {
			this.applyCustomAttributesOnSpan = config.applyCustomAttributesOnSpan;
		}
		this.router = router;
		this.enable();
	}

	override enable(): void {
		if (this.router) {
			if (!this.routerEventSubscription || this.routerEventSubscription?.closed) {
				this.routerEventSubscription = this.router.events.subscribe((event: any) => {
					if (event instanceof NavigationEnd) {
						const span = this.tracer.startSpan('page-change', { attributes: { page: event.url } }, ROOT_CONTEXT);
						span.setAttribute('page', event.url);
						if (this.applyCustomAttributesOnSpan) {
							this.applyCustomAttributesOnSpan(span);
						}
						span.end();
					}
				});
			}
		}
	}

	override disable(): void {
		if (this.routerEventSubscription) {
			this.routerEventSubscription.unsubscribe();
		}
	}
}
*/
