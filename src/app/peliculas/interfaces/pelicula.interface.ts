export interface Pelicula {
	id: number;
	title: string;
	original_title: string;
	overview: string;
	release_date: Date;
	original_language: string;
	vote_average: number;
	vote_count: number;
	poster_path: string;
	backdrop_path: string;
	genre_ids: number[];
	popularity: number;
	video: boolean;
	background?: string;
}

export interface Search {
	page: number,
	results: Pelicula[],
	total_pages: number,
	total_results: number
}