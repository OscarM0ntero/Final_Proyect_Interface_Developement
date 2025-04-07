import { Component, Input, OnInit } from '@angular/core';
import { Pelicula } from '../../interfaces/pelicula.interface';
import { Router } from '@angular/router';
import { PeliculasService } from '../../services/peliculas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'peliculas-pelicula-card-list',
	templateUrl: './card-list.component.html',
	styleUrls: ['./card-list.component.css']

})
export class CardListComponent implements OnInit {
	@Input()
	public pelicula!: Pelicula;
	public noPoster: string = 'assets/no-poster.png';
	public isFav: boolean = false;


	constructor(
		private peliculasService: PeliculasService,
		private router: Router,
		private snackBar: MatSnackBar,
		private dialog: MatDialog
	) { }

	ngOnInit(): void {
		// pelicula debe ser inicializado
		if (!this.pelicula) throw new Error('Pelicula property is required.');
		if (this.pelicula?.id) {
			this.checkIfFav();
		}
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
			this.openConfirmDialog();
		} else {
			this.peliculasService.addFav(this.pelicula.id)
				.subscribe({
					next: () => {
						this.isFav = true;
						this.snackBar.open('Película añadida a favoritos', 'Cerrar', { duration: 3000 });
					},
					error: (err) => {
						this.snackBar.open('Error al añadir la película a favoritos', 'Cerrar', { duration: 3000 });
						console.error(err);
					}
				});
		}
	}

	openConfirmDialog(): void {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: '400px',
			data: {
				title: 'Eliminar de favoritos',
				message: `¿Estás seguro de que quieres eliminar "${this.pelicula.title}" de tus favoritos?`
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.deleteFromFavorites();
			}
		});
	}

	deleteFromFavorites(): void {
		this.peliculasService.delFav(this.pelicula.id)
			.subscribe({
				next: () => {
					this.isFav = false;
					this.snackBar.open('Película eliminada de favoritos', 'Cerrar', { duration: 3000 });
				},
				error: (err) => {
					this.snackBar.open('Error al eliminar la película de favoritos', 'Cerrar', { duration: 3000 });
					console.error(err);
				}
			});
	}

}

