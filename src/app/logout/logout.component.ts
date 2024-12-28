import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,    
  ],
  template: `
    <div class="logout-container">
      <button mat-raised-button color="warn" class="logout-button" (click)="logout()">
        Cerrar sesión
      </button>
    </div>
  `,
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('idSesion');
    this.router.navigate(['/login']);
  }
}
