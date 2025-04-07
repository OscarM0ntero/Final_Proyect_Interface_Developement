import { Component, Input, OnInit } from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'peliculas-pelicula-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']

})
export class CardComponent implements OnInit {
	@Input()
	public pelicula!: Pelicula;
	public noPoster: string = 'assets/no-poster.png';

	constructor(private router: Router) {}

	ngOnInit(): void {
		// pelicula debe ser inicializado
		if (!this.pelicula) throw new Error('Pelicula property is required.');
	}

	formatAverage(number: number): string {
		return number.toFixed(1);
	}

	saveRoute() {
		const currentRoute = this.router.url;
		//Esto es por tema de espacios en la url, que se transforman en %20, los reemplazamos para que cuando vuelva no haya fallos en el input
		const saveRoute = currentRoute.replace(/%20/g, ' ');	
		localStorage.setItem('prevRoute', saveRoute);
	}
	
	
}

