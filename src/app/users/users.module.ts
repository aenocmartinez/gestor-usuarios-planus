import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserCreateComponent } from './user-create/user-create.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    UserListComponent, // Importa los componentes standalone
    UserEditComponent,
    UserCreateComponent,
  ],
})
export class UsersModule {}
