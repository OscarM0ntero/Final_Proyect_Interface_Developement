import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
	providedIn: 'root'
})
export class CommonService {
	headers: HttpHeaders;

	constructor(private cookieService: CookieService) {
		this.headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		});

		// console.log(this.cookieService.get('token'));
	}

	getHeaders() {
		return new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.getItem('token')}`
		});
	}

}
