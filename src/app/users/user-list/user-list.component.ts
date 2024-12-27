import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['nombres', 'apellidos', 'email', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  currentYear: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usersService: UsersService) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator; // Vincula el paginador
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  deleteUser(email: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usersService.deleteUser(email).subscribe(
        (response) => {
          console.log('Usuario eliminado:', response);
          this.loadUsers();
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    }
  }
}
