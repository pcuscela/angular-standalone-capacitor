import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { modaleAvviso } from '../modali/modale-avviso/modale-avviso.component';
import { modaleErrore } from '../modali/modale-errore/modale-errore.component';
import { marker as _ } from '@colsen1991/ngx-translate-extract-marker';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const modalService = inject(NgbModal);
	return next(req).pipe(
		catchError((error: any) => {
			if (error instanceof HttpErrorResponse) {
				switch (error.status) {
					/* Sessione scaduta o login fallito */
					case 401:
						if (authService.isAuthenticated) {
							modaleAvviso(modalService, _('Attenzione'), _('SessioneScadutaError'));
							authService.logout();
						} else {
							modaleAvviso(modalService, _('Attenzione'), _('CredentialiErrateError'));
						}
						break;
					/* Errore con messaggio gestito dal BackEnd */
					case 409:
						modaleAvviso(modalService, _('Attenzione'), error.error?.message || error.error || _('ErroreGenerico'));
						break;
					/* Accesso ad una risorsa non consentito dai permessi dell' utente */
					case 403:
						modaleAvviso(modalService, _('Attenzione'), _('AutorizzazioneNegataError'));
						break;
					default:
						modaleErrore(modalService, 'Errore', error.error?.message || error.error, error);
						break;
				}
			}
			return throwError(error);
		}),
	);
};
