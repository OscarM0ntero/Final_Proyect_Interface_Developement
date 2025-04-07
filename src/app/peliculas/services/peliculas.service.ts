import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { Pelicula, Search } from '../interfaces/pelicula.interface';
import { environments } from 'src/environments/environments';
import { ApiResponse } from 'src/app/shared/interfaces/api-response';
import { CommonService } from 'src/app/shared/common.service';

@Injectable({ providedIn: 'root' })
export class PeliculasService {

	private apiUrl: string = environments.apiUrl;
	private apiKey: string = environments.apiKey;

	private imageUrl: string = environments.imageUrl;
	private backgroundUrl: string = environments.backgroundUrl;

	private baseUrl: string = environments.baseUrl;


	constructor(private http: HttpClient, private commonService: CommonService) { }

	getPeliculas(): Observable<Pelicula[]> {
		return this.http.get<Pelicula[]>(`${this.apiUrl}/peliculas`);
	}

	getPeliculaById(id: string): Observable<Pelicula | undefined> {
		if (id == "search") {
			return of(undefined);
		}
		else {
			return this.http.get<Pelicula>(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`)
				.pipe(
					map(pelicula => {
						this.getFondoById(pelicula.id).subscribe(fondo => {
							pelicula.background = fondo || 'assets/black.png';
						});
						if (pelicula) {
							pelicula.poster_path = pelicula.poster_path
								? `${this.imageUrl}${pelicula.poster_path}`
								: 'assets/no-poster.png';

							pelicula.backdrop_path = pelicula.backdrop_path
								? `${this.imageUrl}${pelicula.backdrop_path}`
								: 'assets/black.png';
						}
						return pelicula;
					}),
					catchError(() => of(undefined))
				);
		}

	}

	getSearch(query: string): Observable<Pelicula[]> {
		const requests = [];

		// Cada página devuelve 20 películas, para mostrar 60 reunimos 3 páginas
		for (let i = 1; i <= 3; i++) {
			requests.push(
				this.http.get<Search>(`${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${i}`)
			);
		}

		return forkJoin(requests).pipe(
			map(results => {
				return results
					.flatMap(result => result.results)
					.map(pelicula => {
						// Modificar los datos directamente en el servicio
						pelicula.poster_path = pelicula.poster_path
							? `${this.imageUrl}${pelicula.poster_path}`
							: 'assets/no-poster.png';

						pelicula.backdrop_path = pelicula.backdrop_path
							? `${this.imageUrl}${pelicula.backdrop_path}`
							: 'assets/black.png';
						return pelicula;
					})
					.sort((a, b) => b.popularity - a.popularity); // Ordenar por popularidad
			})
		);
	}

	getFondoById(id: number): Observable<string | undefined> {
		const url = `${this.apiUrl}/movie/${id}/images?api_key=${this.apiKey}`;

		return this.http.get<any>(url).pipe(
			map(response => {
				if (!response.backdrops || response.backdrops.length === 0) return 'assets/black.png';

				// Ordenar primero por vote_count (descendente) y luego por vote_average (descendente)
				const bestBackdrop = response.backdrops
					.sort((a: any, b: any) => {
						if (b.vote_count !== a.vote_count) {
							return b.vote_count - a.vote_count; // Ordenar por vote_count (mayor primero)
						}
						return b.vote_average - a.vote_average; // Si hay empate, ordenar por vote_average (mayor primero)
					})[0];

				// Devolver la URL completa de la imagen
				return bestBackdrop ? `${this.backgroundUrl}${bestBackdrop.file_path}` : undefined;
			}),
			catchError(() => of(undefined)) // Si hay algún error, devolver undefined
		);
	}

	getFav(): Observable<number[]> {
		return this.http.get<ApiResponse>(`${this.baseUrl}/peliculas_favoritas.php`, { headers: this.commonService.getHeaders() })
			.pipe(
				map((response: ApiResponse) => {
					if (response.ok && response.data) {
						return response.data.map((fav: any) => fav.id_pelicula);
					}
					return [];
				})
			);
	}

	addFav(idPelicula: number): Observable<ApiResponse> {
		const body = { id_pelicula: idPelicula };
		return this.http.post<ApiResponse>(`${this.baseUrl}/peliculas_favoritas.php`, body, { headers: this.commonService.getHeaders() })
			.pipe(
				map(response => {
					if (response.ok) {
						return response;
					} else {
						throw new Error(response.message || 'Error al añadir película');
					}
				})
			);
	}


	delFav(idPelicula: number): Observable<ApiResponse> {
		const body = { id_pelicula: idPelicula };
		return this.http.request<ApiResponse>('delete', `${this.baseUrl}/peliculas_favoritas.php`, { body, headers: this.commonService.getHeaders() })
			.pipe(
				map(response => {
					if (response.ok) {
						return response;
					} else {
						throw new Error(response.message || 'Error al eliminar película');
					}
				})
			);
	}

	checkFav(idPelicula: number): Observable<boolean> {
		return this.getFav().pipe(
			map((favoritas: number[]) =>
				favoritas.includes(idPelicula)
			)
		);
	}

	getPeliculasFav(): Observable<Pelicula[]> {
		return this.getFav().pipe(
			switchMap((ids: number[]) => {
				if (!ids.length) return of([]);

				const requests = ids.map(id =>
					this.getPeliculaById(id.toString()).pipe(
						catchError(() => of(undefined))
					)
				);

				return forkJoin(requests).pipe(
					map((peliculas) =>
						peliculas.filter((pelicula): pelicula is Pelicula => !!pelicula)
					)
				);
			})
		);
	}

}

// https://api.themoviedb.org/3/movie/242582?api_key=3b5faf6c57b79d39e76351663a5e0cbe
// https://api.themoviedb.org/3/search/movie?api_key=3b5faf6c57b79d39e76351663a5e0cbe&query=nightcrawler
