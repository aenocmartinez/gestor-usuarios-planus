import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';

export const routes: Routes = [
  { path: 'users', component: UserListComponent }, 
  { path: 'users/create', component: UserCreateComponent }, 
  { path: 'users/edit/:email', component: UserEditComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/users' }, 
];
