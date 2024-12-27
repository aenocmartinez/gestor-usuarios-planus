import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
  ],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  email: string = '';

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]], 
      password: [''],
      id: [''], 
    });
  }

  ngOnInit(): void {
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
          id: user.id,
        });
      },
      (error) => {
        console.error('Error al cargar los datos del usuario:', error);
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
        id: this.userForm.value.id,
      };
  
      this.usersService.updateUser(user).subscribe(
        (response) => {
          console.log('Usuario actualizado:', response);
          this.router.navigate(['/users']); 
        },
        (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      );
    }
  }
  
}
