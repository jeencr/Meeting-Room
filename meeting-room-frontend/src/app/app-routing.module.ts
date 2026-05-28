import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageBookingsComponent } from './pages/admin/manage-bookings/manage-bookings.component';
import { ManageRoomsComponent } from './pages/admin/manage-rooms/manage-rooms.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { MyBookingsComponent } from './pages/customer/my-bookings/my-bookings.component';
import { CreateBookingComponent } from './pages/customer/create-booking/create-booking.component';
import { RoomListComponent } from './pages/customer/room-list/room-list.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
    {path: '',redirectTo: 'login',pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'rooms', component: RoomListComponent,canActivate: [AuthGuard]},
    {path: 'create-booking', component: CreateBookingComponent,canActivate: [AuthGuard]},
    {path: 'my-bookings', component: MyBookingsComponent,canActivate: [AuthGuard]},
    {path: 'admin/dashboard', component: DashboardComponent,canActivate: [AdminGuard]},
    {path: 'admin/manage-rooms', component: ManageRoomsComponent,canActivate: [AdminGuard]},
    {path: 'admin/manage-bookings', component: ManageBookingsComponent,canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
