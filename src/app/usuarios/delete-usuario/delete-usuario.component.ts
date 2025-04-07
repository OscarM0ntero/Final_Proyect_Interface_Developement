import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '../interfaces/usuario';
import { UsuarioService } from '../services/usuario.service';

@Component({
	selector: 'app-delete-usuario',
	templateUrl: './delete-usuario.component.html',
	styleUrls: ['./delete-usuario.component.css']
})
export class DeleteUsuarioComponent implements OnInit {

	constructor(public dialogRef: MatDialogRef<DeleteUsuarioComponent>,
		@Inject(MAT_DIALOG_DATA) public usuario: Usuario,
		private servicioUsuario: UsuarioService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
	}

	async deleteUser() {
		const RESP = await this.servicioUsuario.deleteUsuario(this.usuario).toPromise();
		if (RESP) {
			if (RESP.ok) {
				this.snackBar.open(RESP.message?RESP.message:"", 'Cerrar', { duration: 5000 });
				this.dialogRef.close({ ok: RESP.ok, data: RESP.data });
			} else {
				this.snackBar.open(RESP.message?RESP.message:"", 'Cerrar', { duration: 5000 });
			}
		}
	}

	onNoClick() {
		this.dialogRef.close({ ok: false });
	}

}
