import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from '../interfaces/rol';
import { Usuario } from '../interfaces/usuario';
import { RolesService } from '../services/roles.service';
import { UsuarioService } from '../services/usuario.service';


@Component({
	selector: 'app-edit-usuario',
	templateUrl: './edit-usuario.component.html',
	styleUrls: ['./edit-usuario.component.css']
})
export class EditUsuarioComponent implements OnInit {

	usuarioForm!: FormGroup;
	roles!: Rol[];

	constructor(public dialogRef: MatDialogRef<EditUsuarioComponent>,
		private servicioRoles: RolesService,
		private servicioUsuario: UsuarioService,
		public snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public usuario: Usuario
	) { }

	ngOnInit() {

		this.usuarioForm = new FormGroup({
			id_usuario: new FormControl(this.usuario.id_usuario, [Validators.required]),
			usuario: new FormControl(this.usuario.usuario, [Validators.required, Validators.email]),
			nombre_publico: new FormControl(this.usuario.nombre_publico),
			password: new FormControl(''),
			habilitado: new FormControl(Number(this.usuario.habilitado) === 1, [Validators.required]),
			id_rol: new FormControl(this.usuario.id_rol, [Validators.required]),
			observaciones: new FormControl(this.usuario.observaciones)
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
		if (this.usuarioForm.valid) {
			const usuario = this.usuarioForm.value;

			const RESP = await this.servicioUsuario.editUsuario(usuario).toPromise();
			if (RESP) {
				if (RESP.ok) {
					this.snackBar.open(RESP.message ? RESP.message : "", 'Cerrar', { duration: 5000 });
					this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
				} else {
					this.snackBar.open(RESP.message ? RESP.message : "", 'Cerrar', { duration: 5000 });
				}
			}
		} else {
			this.snackBar.open('Formulario inválido', 'Cerrar', { duration: 5000 });
		}
	}

	onNoClick(): void {
		this.dialogRef.close({ ok: false });
	}

}
