import { Component } from '@angular/core';
import { modaleAvviso } from '../../shared/modali/modale-avviso/modale-avviso.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { modaleInput } from '../../shared/modali/modale-input/modale-input.component';
import { modaleInputMultiplo } from '../../shared/modali/input-multiplo-modal/input-multiplo-modal.component';
import { modaleConferma } from '../../shared/modali/modale-conferma/modale-conferma.component';
import { modaleErrore } from '../../shared/modali/modale-errore/modale-errore.component';
import { modaleUploadFile } from '../../shared/modali/modale-upload-file/modale-upload-file.component';
import { TrascinabileDirective } from '../../shared/_directives/trascinabile.directive';

import { ApiService } from '../../shared/_services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';

@Component({
	selector: 'app-homepage',
	standalone: true,
	imports: [TrascinabileDirective, FormsModule, NgSelectModule, TranslateModule],
	templateUrl: './homepage.component.html',
	styles: ``,
})
export class HomepageComponent {
	persone = [
		{ nome: 'Mario', cognome: 'Rossi', eta: 30 },
		{ nome: 'Luca', cognome: 'Bianchi', eta: 25 },
		{ nome: 'Giovanni', cognome: 'Verdi', eta: 40 },
	];

	linguaAttiva: string;

	deferredContent: any;

	constructor(
		private modalService: NgbModal,
		private apiService: ApiService,
		private translateService: TranslateService,
	) {
		this.linguaAttiva = this.translateService.currentLang;
	}

	cambiaLingua(lingua: any) {
		this.translateService.use(lingua);
		this.linguaAttiva = lingua;
	}

	colorMode(color: string) {
		document.documentElement.setAttribute('data-bs-theme', color);
	}

	testHttp(code: number) {
		this.apiService.testGet(code).subscribe();
	}

	testHttpResponse() {
		this.apiService.testGetResponse().subscribe((res) => modaleAvviso(this.modalService, 'Risposta', JSON.stringify(res)));
	}

	testGetImage() {
		this.apiService.testGetImage().subscribe((res) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64data = reader.result;
				this.deferredContent = base64data;
			};
			reader.readAsDataURL(res);
		});
	}

	openModal(tipo: string) {
		switch (tipo) {
			case 'avviso':
				modaleAvviso(this.modalService, 'Avviso', 'Messaggio');
				break;
			case 'input':
				modaleInput(this.modalService, 'Titolo', 'Label', 'Testo del bottone');
				break;
			case 'input-multiplo':
				modaleInputMultiplo(this.modalService, 'Titolo', [
					{ label: 'Etichetta 1', id: '1' },
					{ label: 'Etichetta 2', id: '2' },
					{ label: 'Etichetta 3', id: '3' },
				]);
				break;
			case 'conferma':
				modaleConferma(this.modalService, 'Titolo', 'Messaggio', 'Conferma');
				break;
			case 'errore':
				modaleErrore(this.modalService, 'Errore', 'Messaggio');
				break;
			case 'upload-file':
				modaleUploadFile(this.modalService, 'Titolo', 'Scegli un file');
				break;
			default:
				break;
		}
	}
}
