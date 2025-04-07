import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { CookieService } from 'ngx-cookie-service';
import { Usuario } from '../interfaces/usuario';
import { CommonService } from 'src/app/shared/common.service';
import { ApiResponse } from 'src/app/shared/interfaces/api-response';


const ENDPOINT = 'usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios!: Usuario[];

  constructor(private http: HttpClient, private commonService: CommonService) {
  }

  getAllUsuarios() {
    return this.http.get<ApiResponse>(`${environments.baseUrl}/${ENDPOINT}.php`, { headers: this.commonService.headers });
  }

  addUsuario(usuario: Usuario) {
    const body = JSON.stringify(usuario);
    return this.http.post<ApiResponse>(`${environments.baseUrl}/${ENDPOINT}.php`, body, {headers: this.commonService.headers });
  }

  editUsuario(usuario: Usuario, route?: string) {
    const body = JSON.stringify(usuario);

    if (route) {
      route = `?route=${route}`;
    } else {
      route = '';
    }

    return this.http.put<ApiResponse>(`${environments.baseUrl}/${ENDPOINT}.php${route}`, body, { headers: this.commonService.headers });
  }

  deleteUsuario(usuario: Usuario) {
    return this.http.delete<ApiResponse>(`${environments.baseUrl}/${ENDPOINT}.php?id=${usuario.id_usuario}`, { headers: this.commonService.headers });
  }

  removeUsuario(idUser: any) {
    this.usuarios = this.usuarios!.filter(usuario => {
      return Number(usuario.id_usuario) !== Number(idUser);
    });
  }

  updateUsuario(usuario: Usuario) {
    let index = null;
    this.usuarios!.filter((usuarioFilter, indexFilter) => {
      if (usuario.id_usuario === usuarioFilter.id_usuario) {
        index = indexFilter;
      }
    });

    if (index) {
      this.usuarios[index] = usuario;
    }
  }

}
