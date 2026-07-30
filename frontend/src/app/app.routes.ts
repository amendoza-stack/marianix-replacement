import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/pages/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/pages/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'dashboard', loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: '**', redirectTo: 'login' }
];
