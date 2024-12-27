import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = 'http://172.20.23.39:9200/Usuarios';

  constructor(private http: HttpClient, @Inject(AuthService) private authService: AuthService) {} // Usa @Inject

  getUsers(): Observable<any> {
    const url = `${this.baseUrl}`;
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        // console.log('Token dinámico en la solicitud:', token);
        return this.http.get(url, { headers });
      })
    );
  }

  createUser(user: any): Observable<any> {
    const url = `${this.baseUrl}/Agregar`;
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.post(url, user, { headers });
      })
    );
  }

  getUserByEmail(email: string): Observable<any> {
    const url = `${this.baseUrl}/${email}`;
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(url, { headers });
      })
    );
  }

  updateUser(user: any): Observable<any> {
    const url = `${this.baseUrl}/Editar`;
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.put(url, user, { headers });
      })
    );
  } 
  
  deleteUser(email: string): Observable<any> {
    const url = `${this.baseUrl}/Eliminar/${email}`;
    return from(this.authService.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.delete(url, { headers });
      })
    );
  }
  
  
}
