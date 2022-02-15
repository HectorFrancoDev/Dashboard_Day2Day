import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleLoginComponent } from './pages/google-login/google-login.component';
import { TempLoginComponent } from './pages/temp-login/temp-login.component';

const routes: Routes = [

  // auth
  {
    path: '',
    component: GoogleLoginComponent
  },
  // auth/temp_login
  {
    path: 'temp_login',
    component: TempLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
