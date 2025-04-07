import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosComponent } from './usuarios.component';
import { LayoutPageComponent } from '../peliculas/pages/layout-page/layout-page.component';

//const routes: Routes = [{ path: '', component: UsuariosComponent }];

const routes: Routes = [
  {
	path: '',
	component: LayoutPageComponent,
	children: [
	  { path: '', component: UsuariosComponent},
	]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
