import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'ma-modale-upload-file',
	standalone: true,
	imports: [CommonModule, FormsModule, NgbModule, TranslateModule],
	templateUrl: './modale-upload-file.component.html',
})
export class ModaleUploadFile implements OnInit {
	title = '';
	label = '';
	button = '';
	buttonClass = '';
	close = '';
	file: File | undefined;

	constructor(
		public modal: NgbActiveModal,
		public translate: TranslateService,
	) {}

	ngOnInit() {}

	fileChange(event: any) {
		if (event.target.files.length > 0) {
			this.file = event.target.files[0];
		}
	}
}

/**
 * Opens a modal dialog for uploading a file.
 *
 * @param modalService - The NgbModal service used to open the modal.
 * @param title - The title of the modal dialog.
 * @param label - The label for the file upload input. Default is 'CaricaFileLabel'.
 * @param button - The text for the upload button. Default is 'Carica'.
 * @param buttonClass - The CSS class for the upload button. Default is 'btn-primary'.
 * @param close - The text for the close button. Default is 'Chiudi'.
 * @returns A promise that resolves with the result of the modal dialog.
 */
export function modaleUploadFile(
	modalService: NgbModal,
	title: string,
	label: string = 'CaricaFileLabel',
	button: string = 'Carica',
	buttonClass = 'btn-primary',
	close = 'Chiudi',
): Promise<any> {
	const modal = modalService.open(ModaleUploadFile, { size: 'md' });
	modal.componentInstance.title = title;
	modal.componentInstance.label = label;
	modal.componentInstance.button = button;
	modal.componentInstance.buttonClass = buttonClass;
	modal.componentInstance.close = close;
	return modal.result;
}
