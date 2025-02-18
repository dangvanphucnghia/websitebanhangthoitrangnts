import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  {
    path: '', // thêm path riêng cho home
    component: HomeComponent,
  },
  {
    path: 'register', // empty path cho trang mặc định
    component: RegisterComponent, // Register là trang mặc định
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '**', // wildcard route cho các URL không hợp lệ
    redirectTo: '', // redirect về trang mặc định
  },
];
