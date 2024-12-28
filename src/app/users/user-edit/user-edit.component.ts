import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  errorMessage: string | null = null;
  email: string = '';

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // Deshabilitado para edición
      password: [''], // Opcional
      id: [''], // Campo oculto para enviar el ID del usuario
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token no disponible. Redirigiendo al login...');
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
        
    this.email = this.route.snapshot.paramMap.get('email') || '';
    this.loadUserData();
  }

  loadUserData(): void {
    this.usersService.getUserByEmail(this.email).subscribe(
      (user) => {
        this.userForm.patchValue({
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          id: user.id, // Carga el ID del usuario
        });
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
        this.snackBar.open(
          'Error al cargar los datos del usuario. Intenta de nuevo.',
          'Cerrar',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user = {
        Nombres: this.userForm.value.nombres,
        Apellidos: this.userForm.value.apellidos,
        Email: this.userForm.getRawValue().email, // Obtener el valor deshabilitado
        Password: this.userForm.value.password || '', // Si no se actualiza, enviar vacío
        id: this.userForm.value.id, // ID del usuario
      };

      this.usersService.updateUser(user).subscribe(
        (response) => {
          this.snackBar.open('Usuario actualizado exitosamente.', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/users']); // Redirige al listado de usuarios
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
          this.errorMessage = 'No se pudo actualizar el usuario. Por favor, intenta de nuevo.';
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/users']); // Redirige al listado de usuarios
  }
}
