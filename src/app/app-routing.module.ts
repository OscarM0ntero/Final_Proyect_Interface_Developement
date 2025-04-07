import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';

import { AuthGuardService as AuthGuard } from './auth/guards/auth.guard';
import { PublicGuard } from './auth/guards/public.guard';

const routes: Routes = [
	{
		path: 'auth',
		loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
		canActivate: [PublicGuard]
	},
	{
		path: 'peliculas',
		loadChildren: () => import('./peliculas/peliculas.module').then(m => m.PeliculasModule),
		canActivate: [AuthGuard]
	},
	{
		path: 'usuarios',
		loadChildren: () => import('./usuarios/usuarios.module').then(m => m.UsuariosModule),
		canActivate: [AuthGuard]
	},
	{
		path: '404',
		component: Error404PageComponent
	},
	{
		path: '',
		redirectTo: 'peliculas',
		pathMatch: 'full'
	},
	{
		path: '**',
		redirectTo: '404',
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
