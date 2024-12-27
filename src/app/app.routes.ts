import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';
import { UserCreateComponent } from './users/user-create/user-create.component';

export const routes: Routes = [
  { path: 'users', component: UserListComponent }, 
  { path: 'users/create', component: UserCreateComponent }, 
  { path: '', redirectTo: '/users', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/users' }, 
];
