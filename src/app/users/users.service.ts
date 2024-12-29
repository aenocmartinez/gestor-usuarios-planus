import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { AuthService } from '../core/auth.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = 'http://172.20.23.39:9200/Usuarios';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token no disponible.');
      return new HttpHeaders(); // Devuelve un encabezado vacío
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
  
  assignRoleToUser(idUsuario: string, idMuseo: number, idRol: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/AsignarRolAUsuario`;
    const body = {
      idUsuario,
      idRol,
      idMuseo,
    };
  
    return this.http.put(url, body, { headers });
  }  

  getUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}`, { headers });
  }

  createUser(user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/Agregar`, user, { headers });
  }

  getUserByEmail(email: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/${email}`, { headers });
  }

  updateUser(user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.baseUrl}/Editar`, user, { headers });
  }

  deleteUser(email: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/Eliminar/${email}`, { headers });
  }

  addUserToMuseum(idUsuario: string, idMuseo: number = 1): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.baseUrl}/AgregarAMuseo`;
    const body = { idUsuario, idMuseo };
    return this.http.post(url, body, { headers });
  }
  
  getRolesByMuseo(idMuseo: number): Observable<any[]> {
    const url = `http://172.20.23.39:9200/Museos/ObtenerRolesPorMuseo/${idMuseo}`;
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(url, { headers });
  }

  assignPasswordToUser(emailUsuario: string, password: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = 'http://172.20.23.39:9200/Autenticacion/AsignarPasswordAUsuario';
    const body = { emailUsuario, password };
  
    return this.http.put(url, body, { headers });
  }  
  
}
