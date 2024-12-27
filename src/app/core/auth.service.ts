import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://172.20.23.39:9200/Autenticacion/Login';
  private token: string = ''; // Almacenar el token en memoria

  constructor(private http: HttpClient) {}

  async getToken(): Promise<string> {
    if (this.token) {
      console.log('Token desde memoria:', this.token); 
      return this.token;
    }

    const response: any = await this.http
      .post(this.baseUrl, { email: 'jose_murcia@museonacional.gov.co', password: 'Mnc1234*' })
      .toPromise();

    this.token = response.token;
    // console.log('Token obtenido del servidor:', this.token); 
    return this.token;
  }
}
