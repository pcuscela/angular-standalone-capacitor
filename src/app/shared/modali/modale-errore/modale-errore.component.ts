import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService } from '../../_services/config.service';

@Component({
	selector: 'ma-modale-avviso',
	standalone: true,
	imports: [CommonModule, FormsModule, NgbModule, TranslateModule, NgSelectModule],
	templateUrl: './modale-errore.component.html',
})
export class ModaleErroreComponent implements OnInit {
	title = 'Avviso';
	message = 'Message';
	close = 'Annulla';
	erroreHttp?: HttpErrorResponse;
	hrefInvioMail = '';

	constructor(
		public modal: NgbActiveModal,
		private config: ConfigService,
	) {}

	ngOnInit() {}

	setHrefInvioMail() {
		const destinatatrioInvioEmailSegnalazioniErrore = this.config.configuration.destinatatrioInvioEmailSegnalazioniErrore;
		const oggettoInvioEmailSegnalazioniErrore = this.config.configuration.oggettoInvioEmailSegnalazioniErrore;
		let testoInvioEmailSegnalazioniErrore = `
<Per favore inserire una descrizione dell' errore che si sta riscontrando, se possibile allegare uno screenshot della pagina >

----------------------------

URL applicativo: ${window.location.href}
User: ${localStorage.getItem('alfresco-user')}
Timestamp: ${new Date().toISOString()}
`;
		if (this.erroreHttp) {
			testoInvioEmailSegnalazioniErrore += `
----------------------------

Url: ${this.erroreHttp.url}
Codice Errore: ${this.erroreHttp.status} - ${this.erroreHttp.statusText}
Errore: ${JSON.stringify(this.erroreHttp.error)}
`;
		}

		this.hrefInvioMail = `mailto:${destinatatrioInvioEmailSegnalazioniErrore}?subject=${encodeURIComponent(
			oggettoInvioEmailSegnalazioniErrore,
		)}&body=${encodeURIComponent(testoInvioEmailSegnalazioniErrore)}`;
	}
}

/**
 *
 * @param modalService
 * @param message
 * @param erroreHttp
 * @returns
 */
export function modaleErrore(
	modalService: NgbModal,
	title: string,
	message: string,
	erroreHttp?: HttpErrorResponse,
	close: string = 'Annulla',
): Promise<boolean> {
	const modal = modalService.open(ModaleErroreComponent, { size: 'md' });
	modal.componentInstance.title = title;
	modal.componentInstance.message = message;
	modal.componentInstance.erroreHttp = erroreHttp;
	modal.componentInstance.close = close;
	modal.componentInstance.setHrefInvioMail();
	return modal.result;
}
