import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { PeliculasService } from '../../services/peliculas.service';

@Component({
	selector: 'app-fav-list-page',
	templateUrl: './fav-list-page.component.html',
	styleUrls: ['./fav-list-page.component.css']
})
export class FavListPageComponent implements OnInit {

	peliculasFav: Pelicula[] = [];

	constructor(private peliculasService: PeliculasService,) { }

	ngOnInit(): void {
		this.peliculasService.getPeliculasFav()
			.subscribe({
				next: (peliculas) => {
					this.peliculasFav = peliculas;
				}
			});
	}
}
