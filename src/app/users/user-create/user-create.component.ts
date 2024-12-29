import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnInit {
  userForm: FormGroup;
  errorMessage: string | null = null;
  roles: { idRol: string; nombreRol: string }[] = []; 

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      idRol: ['', [Validators.required]], 
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

    this.loadRoles(); 
  }

  private loadRoles(): void {
    const idMuseo = 1; 
    this.usersService.getRolesByMuseo(idMuseo).subscribe(
      (rolesResponse) => {
        this.roles = rolesResponse.map((rol: any) => ({
          idRol: rol.idRol,
          nombreRol: rol.nombreRol,
        }));
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
        this.errorMessage = 'No se pudieron cargar los roles. Intente nuevamente.';
      }
    );
  }

  onSubmit(): void {
    this.errorMessage = null; 
    if (this.userForm.valid) {
      const email = this.userForm.value.email; 
      const idRol = this.userForm.value.idRol; 
      const idMuseo = 1;

      this.usersService.createUser(this.userForm.value).subscribe(
        () => {
          this.usersService.getUserByEmail(email).subscribe(
            (userResponse) => {
              const idUsuario = userResponse?.id;

              if (idUsuario) {
                this.usersService.addUserToMuseum(idUsuario).subscribe(
                  () => {
                    this.usersService.assignRoleToUser(idUsuario, idMuseo, idRol).subscribe(
                      () => {
                        this.snackBar.open('Usuario creado, asociado al museo y rol asignado exitosamente.', 'Cerrar', {
                          duration: 5000,
                          verticalPosition: 'top',
                          horizontalPosition: 'center',
                          panelClass: ['success-snackbar'],
                        });
                        this.router.navigate(['/users']);
                      },
                      (error) => {
                        console.error('Error al asignar rol al usuario:', error);
                        this.errorMessage = 'El usuario fue creado y asociado al museo, pero no pudo asignarse el rol.';
                      }
                    );
                  },
                  (error) => {
                    console.error('Error al asociar usuario al museo:', error);
                    this.errorMessage = 'El usuario fue creado, pero no pudo ser asociado al museo.';
                  }
                );
              } else {
                this.errorMessage = 'Usuario creado, pero no se pudo obtener el ID para asociarlo al museo.';
              }
            },
            (error) => {
              console.error('Error al obtener ID del usuario:', error);
              this.errorMessage = 'El usuario fue creado, pero no se pudo obtener su información.';
            }
          );
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
