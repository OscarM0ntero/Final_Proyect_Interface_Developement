import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { FavListPageComponent } from './pages/fav-list-page/fav-list-page.component';
import { PeliculaPageComponent } from './pages/pelicula-page/pelicula-page.component';

const routes: Routes = [
  {
    // localhost:4200/auth/
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'search/:query', component: SearchPageComponent},
      { path: 'fav-list', component: FavListPageComponent},
      { path: ':id', component: PeliculaPageComponent},
      { path: '**', redirectTo: 'search/'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeliculasRoutingModule { }
