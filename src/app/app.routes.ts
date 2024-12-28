import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Asegúrate de que esta ruta esté antes
  { path: 'users', component: UserListComponent },
  { path: 'users/create', component: UserCreateComponent },
  { path: 'users/edit/:email', component: UserEditComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a login por defecto
  { path: '**', redirectTo: '/login' }, // Wildcard path para rutas inexistentes
];
