import { Pipe, PipeTransform } from '@angular/core';
import { environments } from 'src/environments/environments';

@Pipe({
	name: 'noPoster'
})
export class NoPosterPipe implements PipeTransform {

	transform(value: string | null | undefined): string {
		return value ? `${environments.imageUrl}${value}` : 'assets/no-poster.png';
	}

}
