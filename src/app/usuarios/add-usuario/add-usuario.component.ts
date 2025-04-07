import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from '../interfaces/rol';
import { RolesService } from '../services/roles.service';
import { UsuarioService } from '../services/usuario.service';


@Component({
	selector: 'app-add-usuario',
	templateUrl: './add-usuario.component.html',
	styleUrls: ['./add-usuario.component.css']
})
export class AddUsuarioComponent implements OnInit {
	usuarioForm!: FormGroup;
	roles!: Rol[];

	constructor(public dialogRef: MatDialogRef<AddUsuarioComponent>,
		private servicioRoles: RolesService,
		private servicioUsuario: UsuarioService,
		public snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.usuarioForm = new FormGroup({
			usuario: new FormControl(null, [Validators.required, Validators.email]),
			password: new FormControl(null, [Validators.required]),
			id_rol: new FormControl(null, [Validators.required]),
			nombre_publico: new FormControl(null),
			observaciones: new FormControl(null)
		});

		this.getRoles();
	}

	async getRoles() {
		const RESPONSE = await this.servicioRoles.getAllRoles().toPromise();
		if (RESPONSE && RESPONSE.ok) {
			this.roles = RESPONSE.data as Rol[];
		}
	}

	async confirmAdd() {
		// console.log(this.usuarioForm.value);
		if (this.usuarioForm.valid) {
			const usuario = this.usuarioForm.value;

			const RESP = await this.servicioUsuario.addUsuario(usuario).toPromise();
			if (RESP) {
				if (RESP.ok) {
					this.snackBar.open(RESP.message ? RESP.message : "", 'Cerrar', { duration: 5000 });
					this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
				} else {
					this.snackBar.open(RESP.message ? RESP.message : "", 'Cerrar', { duration: 5000 });
				}
			} else {
				this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 5000 });
			}
		}
	}

	onNoClick(): void {
		this.dialogRef.close({ ok: false });
	}

}
