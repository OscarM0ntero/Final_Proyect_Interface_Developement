import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { PeliculasService } from '../../services/peliculas.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';


@Component({
	selector: 'app-search-page',
	templateUrl: './search-page.component.html',
	styleUrls: ['./search-page.component.css']
})

export class SearchPageComponent implements OnInit {
	public searchInput = new FormControl('');
	public peliculas: Pelicula[] = [];
	public selectedPelicula?: Pelicula;

	@ViewChild('searchInputRef') searchInputRef!: ElementRef<HTMLInputElement>;


	constructor(
		private peliculasService: PeliculasService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			const query = params.get('query');
			if (query) {
				this.searchInput.setValue(query, { emitEvent: false });
				this.searchPelicula();
			}
		});
		setTimeout(() => {
			this.searchInputRef.nativeElement.focus();
		}, 0);
	}


	public searchPelicula() {

		const value: string = this.searchInput.value || '';

		this.router.navigate(['/peliculas/search', value]);

		this.peliculasService.getSearch(value).subscribe(peliculas => {
			this.peliculas = peliculas;
			this.peliculas = [...this.peliculas];
		});
	}


	public onSelectedOption(event: MatAutocompleteSelectedEvent) {
		if (!event.option.value) {
			this.selectedPelicula = undefined;
			return;
		}
		const pelicula: Pelicula = event.option.value;
		this.searchInput.setValue(pelicula.title);
		this.selectedPelicula = pelicula;

	}
}
