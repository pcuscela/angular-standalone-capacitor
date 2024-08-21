import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'ma-input-multiplo-modal',
	standalone: true,
	imports: [CommonModule, FormsModule, NgbModule, TranslateModule, NgSelectModule],
	templateUrl: './input-multiplo-modal.component.html',
})
export class ModaleInputMultiploComponent implements OnInit {
	title = '';
	button = '';
	close = '';
	buttonClass = '';
	inputs: InputModale[] = [];

	constructor(public modal: NgbActiveModal) {}

	ngOnInit() {}
}

export interface InputModale {
	id: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	value?: string;
	disabled?: boolean;
	type?: 'text' | 'number' | 'select' | 'textarea';
	selectOptions?: { value: string; label: string }[];
}

/**
 * Opens a multiple input modal dialog using the NgbModal service.
 *
 * @param modalService - The NgbModal service used to open the modal.
 * @param title - The title of the modal dialog.
 * @param inputs - An array of InputModale objects representing the inputs in the modal dialog.
 * @param button - The label for the save button in the modal dialog. Default is 'Salva'.
 * @param close - The label for the close button in the modal dialog. Default is 'Annulla'.
 * @param buttonClass - The CSS class for the save button in the modal dialog. Default is 'btn-primary'.
 * @returns A Promise that resolves to an array of InputModale objects representing the values entered in the modal dialog.
 */
export function modaleInputMultiplo(
	modalService: NgbModal,
	title: string,
	inputs: InputModale[],
	button = 'Salva',
	close = 'Annulla',
	buttonClass = 'btn-primary',
): Promise<InputModale[]> {
	const modal = modalService.open(ModaleInputMultiploComponent, { centered: false, windowClass: '' });
	modal.componentInstance.title = title;
	modal.componentInstance.button = button;
	modal.componentInstance.close = close;
	modal.componentInstance.buttonClass = buttonClass;
	modal.componentInstance.inputs = inputs;
	inputs.filter((input) => input.type === 'select').forEach((input) => (input.selectOptions = input.selectOptions || []));
	return modal.result;
}
