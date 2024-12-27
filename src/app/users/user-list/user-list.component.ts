import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
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
}
