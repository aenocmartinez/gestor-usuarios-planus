import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from '../users.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: any[] = []; // Lista de usuarios

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers(); // Cargar usuarios al iniciar
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(
      (data: any) => {
        console.log('Usuarios recibidos:', data); // Verificar los datos
        this.users = data; // Asignar los usuarios al array
      },
      (error) => {
        console.error('Error al cargar usuarios:', error); // Mostrar errores
      }
    );
  }

  deleteUser(email: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usersService.deleteUser(email).subscribe(
        (response) => {
          console.log('Usuario eliminado:', response);
          this.loadUsers(); // Recargar la lista de usuarios después de eliminar
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    }
  }
  
}
