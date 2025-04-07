import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { delay, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-pelicula-page',
	templateUrl: './pelicula-page.component.html',
	styleUrls: ['./pelicula-page.component.css']
})
export class PeliculaPageComponent implements OnInit {

	public pelicula?: Pelicula;
	public isFav: boolean = false;

	constructor(
		private peliculasService: PeliculasService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.pelicula = undefined;

		this.activatedRoute.params
			.pipe(
				delay(Math.floor(Math.random() * (1000 - 0 + 1))), // Retraso aleatorio para simular carga
				switchMap(({ id }) =>
					this.peliculasService.getPeliculaById(id)
				)
			)
			.subscribe(pelicula => {
				if (!pelicula) return this.router.navigate(['/peliculas']);
				this.pelicula = pelicula;

				if (this.pelicula?.id) {
					this.checkIfFav();
				}
				return;
			});
	}

	checkIfFav(): void {
		if (this.pelicula) {
			this.peliculasService.checkFav(this.pelicula.id)
				.subscribe(isFav => {
					this.isFav = isFav;
				});
		}
	}

	toggleFav(): void {
		if (!this.pelicula) return;

		if (this.isFav) {
			this.peliculasService.delFav(this.pelicula.id)
				.subscribe({
					next: () => {
						this.isFav = false;
						this.snackBar.open('Película eliminada de favoritos', 'Cerrar', {duration: 3000});
					},
					error: (err) => {
						this.snackBar.open('Error al eliminar la película de favoritos', 'Cerrar', {duration: 3000});
						console.error(err);
					}
				});
		} else {
			this.peliculasService.addFav(this.pelicula.id)
				.subscribe({
					next: () => {
						this.isFav = true;
						this.snackBar.open('Película añadida a favoritos', 'Cerrar', {duration: 3000});
					},
					error: (err) => {
						this.snackBar.open('Error al añadir la película a favoritos', 'Cerrar', {duration: 3000});
						console.error(err);
					}
				});
		}
	}

	goBack(): void {
		const prevRoute = localStorage.getItem('prevRoute') || '/peliculas';
		this.router.navigate([prevRoute]);
	}

	formatAverage(number: number): string {
		return number.toFixed(1);
	}

	getFlag(lang: string): string {
		const languageToCountryMap: { [key: string]: string } = {
			'en': 'GB', 'es': 'ES', 'it': 'IT', 'de': 'DE', 'fr': 'FR', 'ja': 'JP', 'ko': 'KR', 'zh': 'CN', 'pt': 'PT',
			'ru': 'RU', 'ar': 'SA', 'nl': 'NL', 'tr': 'TR', 'hi': 'IN', 'bn': 'BD', 'pa': 'IN', 'ur': 'PK', 'vi': 'VN',
			'th': 'TH', 'fa': 'IR', 'pl': 'PL', 'uk': 'UA', 'cs': 'CZ', 'ro': 'RO', 'hu': 'HU', 'el': 'GR', 'sv': 'SE',
			'da': 'DK', 'fi': 'FI', 'no': 'NO', 'he': 'IL', 'id': 'ID', 'ms': 'MY', 'tl': 'PH', 'mn': 'MN', 'ka': 'GE',
			'et': 'EE', 'lv': 'LV', 'lt': 'LT', 'sk': 'SK', 'sl': 'SI', 'hr': 'HR', 'sr': 'RS', 'bg': 'BG', 'mk': 'MK',
			'sq': 'AL', 'hy': 'AM', 'az': 'AZ', 'kk': 'KZ', 'uz': 'UZ', 'tk': 'TM', 'my': 'MM', 'km': 'KH', 'lo': 'LA',
			'si': 'LK', 'ml': 'IN', 'te': 'IN', 'kn': 'IN', 'ta': 'IN', 'hk': 'HK', 'yue': 'HK', 'cn': 'CN'
		};

		const countryCode = languageToCountryMap[lang];
		if (!countryCode) return '🏳️';

		return countryCode
			.split('')
			.map(char => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65))
			.join('');
	}
}
