import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent {
  userForm: FormGroup;
  errorMessage: string | null = null; // Propiedad para almacenar el mensaje de error

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.errorMessage = null; // Limpiar cualquier mensaje de error anterior
    if (this.userForm.valid) {
      this.usersService.createUser(this.userForm.value).subscribe(
        (response) => {
          console.log('Usuario creado:', response);
          this.router.navigate(['/users']); // Redirigir al listado de usuarios
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          // Manejo del error para mostrar el mensaje al usuario
          if (error.status === 400 && error.error) {
            this.errorMessage = this.getPasswordRequirementsMessage(error); 
            // this.errorMessage = error.error; 
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
          }
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/users']); // Redirige al listado de usuarios
  }

  private getPasswordRequirementsMessage(error: any): string {
    const errorText = error?.error || '';
    const requirements: string[] = [];
  
    if (errorText.includes('Passwords must have at least one non alphanumeric character')) {
      requirements.push('al menos un carácter no alfanumérico (por ejemplo: @, #, !).');
    }
    if (errorText.includes('Passwords must have at least one lowercase')) {
      requirements.push('al menos una letra minúscula (a-z).');
    }
    if (errorText.includes('Passwords must have at least one uppercase')) {
      requirements.push('al menos una letra mayúscula (A-Z).');
    }
    if (errorText.includes('Passwords must have at least one digit')) {
      requirements.push('al menos un número (0-9).');
    }
  
    if (requirements.length > 0) {
      return `La contraseña debe contener ${requirements.join(' ')}`;
    }
  
    return 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
  }
  
  
}
