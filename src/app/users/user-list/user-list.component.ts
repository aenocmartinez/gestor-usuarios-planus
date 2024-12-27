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
import { Router, RouterModule } from '@angular/router';
import { UsersService } from '../users.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule, // Importa MatSnackBarModule
  ],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['nombres', 'apellidos', 'email', 'acciones'];
  dataSource = new MatTableDataSource<any>([]);
  currentYear: number;
  successMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar // Inyección de MatSnackBar
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.checkSuccessMessage();
    this.loadUsers();
  }

  checkSuccessMessage(): void {
    // Captura el mensaje desde el estado del enrutador
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { successMessage?: string };
    this.successMessage = state?.successMessage || null;

    if (this.successMessage) {
      // Muestra el mensaje en un MatSnackBar
      this.snackBar.open(this.successMessage, 'Cerrar', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['success-snackbar'],
      });

      // Borra el mensaje del estado después de mostrarlo
      setTimeout(() => {
        this.successMessage = null;
      }, 5000);
    }
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
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
        () => {
          this.snackBar.open('Usuario eliminado correctamente.', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar'],
          });
          this.loadUsers();
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    }
  }
}
