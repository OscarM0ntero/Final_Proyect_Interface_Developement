import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from "@angular/core";

@Injectable()
export class MatPaginatorCustom extends MatPaginatorIntl {

	override itemsPerPageLabel: string = 'Elementos a mostrar';
	override nextPageLabel: string = 'Página siguiente';
	override previousPageLabel: string = 'Página anterior';

	override getRangeLabel = (page: number, pageSize: number, length: number): string => {
		if (length === 0 || pageSize === 0) {
			return '0 de ' + length;
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;
		// Si el índice de inicio supera la longitud, no ajustar el índice de fin al final.
		const endIndex = startIndex < length ?
			Math.min(startIndex + pageSize, length) :
			startIndex + pageSize;
		return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
	};
}
