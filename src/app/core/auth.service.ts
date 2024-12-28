import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';

  constructor() {}

  // Obtener el token desde sessionStorage
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  // Guardar el token en sessionStorage
  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  // Eliminar el token de sessionStorage (por ejemplo, al cerrar sesión)
  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
