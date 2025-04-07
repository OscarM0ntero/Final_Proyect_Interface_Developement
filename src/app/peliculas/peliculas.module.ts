import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeliculasRoutingModule } from './peliculas-routing.module';
import { PeliculaPageComponent } from './pages/pelicula-page/pelicula-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { FavListPageComponent } from './pages/fav-list-page/fav-list-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { MaterialModule } from '../material/material.module';
import { CardComponent } from './components/card/card.component';
//import { HeroImagePipe } from './pipes/hero-image.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { NoPosterPipe } from './pipes/no-poster.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardListComponent } from './components/card-list/card-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
	declarations: [
		PeliculaPageComponent,
		LayoutPageComponent,
		FavListPageComponent,
		SearchPageComponent,
		CardComponent,
		CardListComponent,
		NoPosterPipe,
		ConfirmDialogComponent
	],
	imports: [
		CommonModule,
		PeliculasRoutingModule,
		MaterialModule,
		ReactiveFormsModule,
		MatTooltipModule,
		MatDialogModule

	]
})
export class PeliculasModule { }
