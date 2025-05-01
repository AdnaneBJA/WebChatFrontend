import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'chatbox', component: ChatboxComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
