import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-modale-input',
	standalone: true,
	imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
	templateUrl: './modale-input.component.html',
})
export class ModaleInputComponent implements OnInit {
	title = '';
	label = '';
	button = '';
	close = '';
	buttonClass = '';
	placeholder = '';
	isMail = false;
	required = false;
	value: string | undefined;

	constructor(public modal: NgbActiveModal) {}

	ngOnInit() {}
}

/**
 * Opens a modal dialog for input and returns a promise that resolves with the user's input.
 * @param modalService - The NgbModal service used to open the modal dialog.
 * @param title - The title of the modal dialog.
 * @param label - The label for the input field in the modal dialog.
 * @param button - The text for the button in the modal dialog (default: 'Salva').
 * @param required - A boolean indicating whether the input field is required (default: false).
 * @param isMail - A boolean indicating whether the input field should validate email format (default: false).
 * @param close - The text for the close button in the modal dialog (default: 'Annulla').
 * @param buttonClass - The CSS class for the button in the modal dialog (default: 'btn-primary').
 * @param placeholder - The placeholder text for the input field in the modal dialog.
 * @returns A promise that resolves with the user's input.
 */
export function modaleInput(
	modalService: NgbModal,
	title: string,
	label: string,
	button = 'Salva',
	required = false,
	isMail = false,
	close = 'Annulla',
	buttonClass = 'btn-primary',
	placeholder = '',
): Promise<string> {
	const modal = modalService.open(ModaleInputComponent, { centered: false, windowClass: '' });
	modal.componentInstance.title = title;
	modal.componentInstance.label = label;
	modal.componentInstance.button = button;
	modal.componentInstance.close = close;
	modal.componentInstance.buttonClass = buttonClass;
	modal.componentInstance.placeholder = placeholder;
	modal.componentInstance.isMail = isMail;
	modal.componentInstance.required = required;
	return modal.result;
}
