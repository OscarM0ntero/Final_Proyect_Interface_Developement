import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PublicGuard implements CanActivate {

	constructor(private auth: AuthService, private router: Router) { }

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

		const response = await this.auth.isAuthenticated('/peliculas');
		if (response) {
			this.router.navigate(['/peliculas']);
			return false;
		}

		return true;
	}

}
