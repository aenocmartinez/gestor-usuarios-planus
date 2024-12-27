import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list/user-list.component';

export const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: '**', redirectTo: '/users' },
];
