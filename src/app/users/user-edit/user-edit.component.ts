import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  errorMessage: string | null = null;
  email: string = '';
  userId: string = ''; 
  currentRoleId: string | null = null; 
  roles: { value: string; label: string }[] = []; 

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
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: [''],
      id: [''],
      rol: ['', [Validators.required]], 
    });
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.paramMap.get('email') || '';
    this.loadUserData();
    this.loadRoles(); 
  }

  loadRoles(): void {
    const idMuseo = 1; 
    this.usersService.getRolesByMuseo(idMuseo).subscribe(
      (roles) => {
        this.roles = roles.map((role) => ({
          value: role.idRol,
          label: role.nombreRol,
        }));
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
        this.snackBar.open('Error al cargar los roles disponibles.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  loadUserData(): void {
    this.usersService.getUserByEmail(this.email).subscribe(
      (user) => {
        this.userId = user.id;
        this.currentRoleId = user.museosYRoles?.[0]?.roles?.[0]?.id || null; 

        this.userForm.patchValue({
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          id: user.id,
          rol: this.currentRoleId, 
        });
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
        this.snackBar.open('Error al cargar los datos del usuario. Intenta de nuevo.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user = {
        Nombres: this.userForm.value.nombres,
        Apellidos: this.userForm.value.apellidos,
        Email: this.userForm.getRawValue().email,
        Password: this.userForm.value.password || '',
        id: this.userId,
      };
  
      this.usersService.updateUser(user).subscribe(
        () => {
          const newRoleId = this.userForm.value.rol;

          if (!this.currentRoleId) {
            this.usersService.addUserToMuseum(this.userId, 1).subscribe(
              () => {
                this.assignNewRole(newRoleId); 
              },
              (error) => {
                console.error('Error al asignar usuario al museo:', error);
                this.snackBar.open('No se pudo asignar el usuario al museo.', 'Cerrar', {
                  duration: 5000,
                  panelClass: ['error-snackbar'],
                });
              }
            );
          } else if (this.currentRoleId !== newRoleId) {
            
            this.usersService.unassignRoleFromUser(this.userId, this.currentRoleId, 1).subscribe(
              () => {
                this.assignNewRole(newRoleId); 
              },
              (error) => {
                console.error('Error al desasignar rol:', error);
                this.snackBar.open('Error al desasignar el rol actual.', 'Cerrar', {
                  duration: 5000,
                  panelClass: ['error-snackbar'],
                });
              }
            );
          } else {
            
            this.snackBar.open('Usuario actualizado exitosamente.', 'Cerrar', {
              duration: 5000,
              panelClass: ['success-snackbar'],
            });
            this.router.navigate(['/users']);
          }
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
          this.errorMessage = 'No se pudo actualizar el usuario. Por favor, intenta de nuevo.';
        }
      );
    }
  }
  
  private assignNewRole(newRoleId: string): void {
    this.usersService.assignRoleToUser(this.userId, 1, newRoleId).subscribe(
      () => {
        this.snackBar.open('Usuario actualizado y rol asignado exitosamente.', 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/users']);
      },
      (error) => {
        console.error('Error al asignar nuevo rol:', error);
        this.snackBar.open('Usuario actualizado, pero no se pudo asignar el nuevo rol.', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }
  

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
