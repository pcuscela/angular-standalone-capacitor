import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

/**
 * Direttiva per rendere trascinabile un elemento HTML in un *ngFor.
 *
 * Esempio di utilizzo:
 *
 * ```html
 * <div *ngFor="let item of items; let i = index" trascinabile [index]="i" [(items)]="items">
 *  {{ item.nome }}
 * </div>
 * ```
 *
 */
@Directive({
	selector: '[trascinabile]',
	standalone: true,
})
export class TrascinabileDirective implements OnInit {
	@Input() trascinabile: number | undefined;
	@Input() items: any[] | undefined;
	@Output() itemsChange = new EventEmitter<any[]>();

	lastElement: any;

	@HostListener('dragstart', ['$event']) onDragStart(event: any) {
		event.target?.classList.add('dragging');
		this.draggingIndex = this.index;
		this.elementRef.nativeElement.style.cursor = 'grabbing';

		if (!this.items || this.items.length == 0) {
			console.error('TrascinabileDirective -> [(items)] non definito, passare come parametro un array da riordinare.');
			event.preventDefault();
		}
		if (this.index == undefined) {
			console.error(
				`TrascinabileDirective -> [index] non definito, passare come parametro l\'indice dell\'oggetto da riordinare. 
          Es: [trascinabile]="i" dove i è l\'indice dell\'oggetto nel *ngFor="let item of items; let i = index".
          ES2: [index]="$index" se si usa la nuova sintassi angular @for (item of items; track $index).`,
			);
			event.preventDefault();
		}
	}

	@HostListener('dragenter', ['$event']) onDragEnter(event: any) {
		event.preventDefault();
		if (this.draggingIndex != this.index) {
			this.reorderItem();
		}
		this.elementRef.nativeElement.style.cursor = 'grabbing';
		this.elementRef.nativeElement.style.opacity = '1';
	}

	@HostListener('dragover', ['$event']) onDragOver(event: any) {
		event.preventDefault();
		this.elementRef.nativeElement.style.opacity = '0';
		this.elementRef.nativeElement.style.cursor = 'grabbing';
		sessionStorage['lastDragoverElement'] = this.elementRef.nativeElement.id;
	}

	@HostListener('dragleave', ['$event']) onDragLeave(event: any) {
		event.preventDefault();
		this.elementRef.nativeElement.style.opacity = '1';
	}

	@HostListener('dragend', ['$event']) onDragEnd(event: any) {
		event.preventDefault();
		event.target?.classList.remove('dragging');
		this.draggingIndex = undefined;
		this.elementRef.nativeElement.style.opacity = '1';
		this.elementRef.nativeElement.style.cursor = 'grab';
		const lastDragoverElement = document.getElementById(sessionStorage['lastDragoverElement']!);
		if (lastDragoverElement) {
			lastDragoverElement.style.opacity = '1';
			delete sessionStorage['lastDragoverElement'];
		}
	}

	get draggingIndex(): number | undefined {
		return sessionStorage['draggingIndex'];
	}
	set draggingIndex(value: number | undefined) {
		if (value == undefined) {
			delete sessionStorage['draggingIndex'];
			return;
		}
		sessionStorage['draggingIndex'] = value;
	}

	get index(): number | undefined {
		return this.trascinabile;
	}

	constructor(private elementRef: ElementRef) {
		elementRef.nativeElement.setAttribute('draggable', true);
		this.elementRef.nativeElement.style.cursor = 'grab';
	}

	ngOnInit(): void {
		this.elementRef.nativeElement.id = this.elementRef.nativeElement.id + `_trascinabile_${this.index}`;
	}

	reorderItem(): void {
		if (this.items && this.items.length > 0 && this.index != undefined && this.draggingIndex != undefined) {
			const itemToBeReordered = this.items.splice(this.draggingIndex, 1)[0];
			this.items.splice(this.index, 0, itemToBeReordered);
			this.draggingIndex = this.index;
			this.itemsChange.emit(this.items);
			this.lastElement = this.elementRef.nativeElement;
		}
	}
}
