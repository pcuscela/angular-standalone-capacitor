# Angular Standalone Capacitor

## Versioni e link utili

- Angular: 17
- Node.js: >= 18.3 (consigliata: 18.18.1)
- Bootstrap CSS: 5.3 -> [Documentazione e lista componenti](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- NG-Bootstrap: 16 -> [Documentazione e lista componenti](https://ng-bootstrap.github.io/#/components/accordion/overview)
- Icone: Bootstrap -> [Lista e ricerca](https://icons.getbootstrap.com/)

## Build

### TEST

- Comando per la build di _TEST_ -> `npm run build:test`

### PRODUZIONE

- Ricordarsi di aumentare il numero versione in `assets/environment/prod/environment.json`
  - ES. appVersion (1.2 -> 1.3) buildNumber (102001 -> 103000)
- Eseguire comando `npm run app:build:prod`
- Generare le app tramite xCode e Android Studio

## Utility pronte

### Modali

I modali sono richiamabili tramite funzioni esposte globalmente, a cui passare `modalService`: NgbModal

```typescript
constructor(private modalService: NgbModal){}

modaleAvviso(this.modalService, 'Avviso', 'Messaggio');
modaleInput(this.modalService, 'Titolo', 'Label', 'Testo del bottone');
modaleInputMultiplo(this.modalService, 'Titolo', [
  { label: 'Etichetta 1', id: '1' },
  { label: 'Etichetta 2', id: '2' },
  { label: 'Etichetta 3', id: '3' },
]);
modaleConferma(this.modalService, 'Titolo', 'Messaggio', 'Conferma');
modaleErrore(this.modalService, 'Errore', 'Messaggio');
modaleUploadFile(this.modalService, 'Titolo', 'Scegli un file');
```

### Multilingua

`ngx-translate` è già incluso, i file delle traduzioni si trovano in `src/assets/i18n`.
Ricordarsi _se presente il multilingua_ per tutte le etichette nell' applicazione di aggiungere il marcatore translate e di importare il modulo `TranslateModule` nel componente.

```html
<!-- HTML -->
<h3 translate>TitoloPagina</h3> <!-- Elemento standard -->
<p> {{data.studentiAttivi}} {{'StudentiAttivi' | translate}} </p> <!-- Elemento che contiene anche del testo dinamico ( utilizzare la pipe translate ) -->
```

```typescript
/* TypeScript */
import { marker as _ } from '@colsen1991/ngx-translate-extract-marker';

modaleAvviso(modalService, _('AutorizzazioneNegataError'));
```

### Ordinamento delle liste con Drag & Drop

Per ordinare i valori di una lista con il trascinamento della riga si può utilizzare la direttiva `[trascinabile]`, ricordarsi di fornire come parametro l' indice `[index]` e la lista `[(items)]`

```html
<tr *ngFor="let persona of persone; let i = index" [trascinabile]="i" [(items)]="persone">
<!-- oppure -->
@for (persona of persone; track $index) {
  <tr [trascinabile]="$index" [(items)]="persone"></tr>
}
```

## Configurazioni iniziali

### Sentry

Sentry raccoglie gli errori applicativi e li mostra nella sua dashboard in tempo reale, per configurarlo su un nuovo progetto bisogna:

- `Creare il progetto` su piattaforma di Sentry scegliendo come nome lo stesso del repository in cui è ospitato il progetto
  [Sentry](https://kedos.sentry.io/projects/) -> Create Project -> Angular -> I'll create my own alerts later -> nome-progetto
- Non serve seguire gli step di configurazione di sentry perchè sono già stati implementati ma bisogna copiare il valore del campo `dsn` sotto la voce `Configure SDK` in `assets/environment/prod/environment.json`

### OpenTelemetry

OpenTelemetry raccoglie dati significativi sull'interazione dell'utente con l'applicazione (pagine visitate, ordini eseguiti, ecc) e li raccoglie in una pagina configurabile su [Grafana](https://monitoring.kedos-srl.it/grafana/)

- In `assets/environment/prod/environment.json` impostare il nome del service `openTelemetryServiceName` e `openTelemetryAttributes > service` scegliendo lo stesso nome del repository in cui è ospitato il progetto
- Per loggare un evento su openTelemetry usare il service `OpenTelemetryService` chiamando la funzione `log()`

## Documentazione Standalone

Questo progetto template utilizza la struttura 'Standalone' di Angular, di default dalla versione 17.
Rispetto alla struttura classica, nella standalone non sono previsti i moduli, quindi gli import delle librerie vanno fatti direttamente all' interno dei componenti.

Esempio di un componente Standalone:

```typescript
@Component({
	selector: 'app-homepage',
	standalone: true,
  /*
    CommonModule -> Va importato in tutti i componenti, fornisce le direttive base angular (*ngIf, *ngFor, ecc)
    [...] -> Tutti gli altri vanno importati alla bisogna, se il componente usa dei form con [(ngModel)] ad esempio va importato FormsModule
  */
	imports: [CommonModule, FormsModule, NgSelectModule, TranslateModule],
	templateUrl: './homepage.component.html',
	styles: ``,
})
export class HomepageComponent {}
```

Le configurazioni applicative come definizione delle rotte e import dei plugin che hanno impatto su tutto il progetto e non sui singoli componenti invece vanno fatti nel file app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),  /* Importa le rotte */
		provideHttpClient(withInterceptors([tokenInterceptor, httpLogInterceptor, errorInterceptor])),   /* Definisce gli interceptors */
		importProvidersFrom(   /* Qui vanno le importazioni dei plugin che non supportano standalone, se una libreria non vi funziona con standalone definitela qui */
			HttpClientModule,
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
```
