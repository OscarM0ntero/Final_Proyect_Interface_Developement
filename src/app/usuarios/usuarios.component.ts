import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';
import { DeleteUsuarioComponent } from './delete-usuario/delete-usuario.component';
import { FormControl } from '@angular/forms';
import { Usuario } from './interfaces/usuario';
import { Permises } from '../shared/interfaces/api-response';

@Component({
    selector: 'app-usuarios',
    templateUrl: './usuarios.component.html',
    styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
    permises!: Permises;

    idFilter = new FormControl();
    usuarioFilter = new FormControl();
    nombreFilter = new FormControl();
    rolFilter = new FormControl();
    habilitadoFilter = new FormControl();

    displayedColumns!: string[];
    private filterValues = { id_usuario: '', usuario: '', nombre_publico: '', rol: '', habilitado: '' };

    constructor(
        public dialog: MatDialog,
        private servicioUsuarios: UsuarioService
    ) { }

    ngOnInit() {
        this.getUsuarios();
    }

    defaultPermises: Permises = {
        add: false,
        edit: false,
        delete: false
    };

    async getUsuarios() {
        try {
            const RESPONSE = await this.servicioUsuarios.getAllUsuarios().toPromise();

            if (!RESPONSE) {
                console.error('No se pudo obtener la respuesta de usuarios');
                return;
            }

            this.permises = RESPONSE.permises ?? this.defaultPermises;

            if (RESPONSE.ok) {
                this.displayedColumns = ['id_usuario', 'usuario', 'nombre_publico', 'rol', 'habilitado', 'actions'];
                this.servicioUsuarios.usuarios = RESPONSE.data ? RESPONSE.data as Usuario[] : [];
                this.dataSource.data = this.servicioUsuarios.usuarios;
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.dataSource.filterPredicate = this.createFilter();
                this.onChanges();
            }
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    }

    async addUsuario() {
        const dialogRef = this.dialog.open(AddUsuarioComponent, { width: '500px' });
        const RESP = await dialogRef.afterClosed().toPromise();
        if (RESP && RESP.ok) {
            this.servicioUsuarios.usuarios.push(RESP.data);
            this.dataSource.data = this.servicioUsuarios.usuarios;
        }
    }

    async editUsuario(usuario: Usuario) {
        const dialogRef = this.dialog.open(EditUsuarioComponent, {
            data: usuario,
            width: '500px'
        });
        const RESP = await dialogRef.afterClosed().toPromise();
        if (RESP && RESP.ok) {
            this.servicioUsuarios.updateUsuario(RESP.data);
            this.dataSource.data = this.servicioUsuarios.usuarios;
        }
    }

    async deleteUsuario(usuario: Usuario) {
        const dialogRef = this.dialog.open(DeleteUsuarioComponent, { data: usuario });
        const RESP = await dialogRef.afterClosed().toPromise();
        if (RESP && RESP.ok) {
            this.servicioUsuarios.removeUsuario(RESP.data);
            this.dataSource.data = this.servicioUsuarios.usuarios;
        }
    }

    buscarHabilitados(valor: string) {
        this.filterValues.habilitado = valor;
        this.dataSource.filter = JSON.stringify(this.filterValues);
    }

    createFilter(): (usuario: any, filter: string) => boolean {
        const filterFunction = (usuario: any, filter: string): boolean => {
            const searchTerms = JSON.parse(filter);
            return usuario.id_usuario.toString().indexOf(searchTerms.id_usuario) !== -1 &&
                   usuario.usuario.toLowerCase().indexOf(searchTerms.usuario.toLowerCase()) !== -1 &&
                   usuario.nombre_publico.toLowerCase().indexOf(searchTerms.nombre_publico.toLowerCase()) !== -1 &&
                   usuario.rol.toLowerCase().indexOf(searchTerms.rol.toLowerCase()) !== -1 &&
                   (searchTerms.habilitado === 'todos' || usuario.habilitado === searchTerms.habilitado);
        };
        return filterFunction;
    }

    onChanges(): void {
        this.idFilter.valueChanges.subscribe(value => {
            this.filterValues.id_usuario = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });

        this.usuarioFilter.valueChanges.subscribe(value => {
            this.filterValues.usuario = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });

        this.nombreFilter.valueChanges.subscribe(value => {
            this.filterValues.nombre_publico = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });

        this.rolFilter.valueChanges.subscribe(value => {
            this.filterValues.rol = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });

        this.habilitadoFilter.valueChanges.subscribe(value => {
            this.filterValues.habilitado = value;
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    }
}
