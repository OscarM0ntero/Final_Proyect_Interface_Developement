import { Component, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'src/app/shared/common.service';
import { HttpHeaders } from '@angular/common/http';
import { debounceTime } from 'rxjs';

@Component({
	selector: 'app-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
	@Output() valueChange = new EventEmitter();
	@ViewChild('passwordInput') passwordInput!: ElementRef;
	@ViewChild('loginInput') loginInput!: ElementRef<HTMLInputElement>;

	loginForm!: FormGroup;
	step: number = 1;

	constructor(
		private authService: AuthService,
		private router: Router,
		private cookieService: CookieService,
		private snackBar: MatSnackBar,
		private commonService: CommonService
	) { }

	ngOnInit() {
		this.setForm();

		this.loginForm.get('username')?.valueChanges
			.pipe(debounceTime(1500))
			.subscribe(value => {
				if (this.loginForm.get('username')?.invalid) {
					this.snackBar.open('Correo electrónico inválido', 'Cerrar', { duration: 2000 });
				}
			});
		setTimeout(() => {
			this.loginInput.nativeElement.focus();
		}, 100);
	}
	setForm() {
		this.loginForm = new FormGroup({
			username: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', Validators.required)
		});
	}

	onNext() {
		if (this.step === 1 && this.loginForm.get('username')?.valid) {
			this.step = 2;

			setTimeout(() => {
				this.passwordInput.nativeElement.focus();
			}, 100);
		}
	}

	onBack() {
		this.step = 1;
		setTimeout(() => {
			const usernameInput = document.querySelector('input[formControlName="username"]') as HTMLInputElement;
			if (usernameInput) usernameInput.focus();
		}, 100);
	}


	async onLogin() {
		if (this.loginForm.valid) {
			const data = this.loginForm.value;
			const RESPONSE = await this.authService.doLogin(data).toPromise();

			if (RESPONSE && RESPONSE.ok) {
				if (RESPONSE.data.token) {
					localStorage.setItem('token', RESPONSE.data.token);
					localStorage.setItem('usuario', RESPONSE.data.usuario);
					localStorage.setItem('nombre_publico', RESPONSE.data.nombre_publico);
					localStorage.setItem('permisos', RESPONSE.data.id_rol);
					this.commonService.headers = new HttpHeaders({
						'Content-Type': 'application/json',
						Authorization: `Bearer ${RESPONSE.data.token}`
					});
					this.router.navigate(['/peliculas']);
				} else if (RESPONSE.data.valido === 0) {
					this.snackBar.open('Usuario inhabilitado', 'Cerrar', { duration: 5000 });
				} else if (RESPONSE.data.valido === 1) {
					this.snackBar.open('Usuario o contraseña incorrectas', 'Cerrar', { duration: 5000 });
				}
			}
		}
	}

	forgotPassword() {
		this.valueChange.emit(true);
	}

	@HostListener('document:keydown.enter', ['$event'])
	handleEnter(event: KeyboardEvent) {
		if (this.step === 1) {
			this.onNext();
		} else if (this.step === 2) {
			this.onLogin();
		}
	}
}
