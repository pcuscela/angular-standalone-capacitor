import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'ma-modale-avviso',
	standalone: true,
	imports: [FormsModule, NgbModule, TranslateModule],
	templateUrl: './modale-avviso.component.html',
})
export class ModaleAvvisoComponent implements OnInit {
	constructor(public modal: NgbActiveModal) {}

	title = 'Attenzione';
	message = '';

	ngOnInit() {}
}

/**
 * Opens a modal dialog for displaying an alert message.
 *
 * @param modalService - The NgbModal service used to open the modal dialog.
 * @param title - The title of the modal dialog.
 * @param message - The message to be displayed in the modal dialog.
 * @returns A promise that resolves to a boolean indicating whether the modal was closed with a positive action.
 */
export function modaleAvviso(modalService: NgbModal, title: string, message: string): Promise<boolean> {
	const modal = modalService.open(ModaleAvvisoComponent, { size: 'md' });
	modal.componentInstance.title = title;
	modal.componentInstance.message = message;
	return modal.result;
}
