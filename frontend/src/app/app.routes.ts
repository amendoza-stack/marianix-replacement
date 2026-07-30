import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/pages/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/pages/reset-password.component').then(m => m.ResetPasswordComponent) },

  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./modules/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'configuracion/usuarios', loadComponent: () => import('./modules/configuracion/usuarios/components/usuarios-page-list.component').then(m => m.UsuariosPageListComponent) },
      { path: 'configuracion/roles', loadComponent: () => import('./modules/configuracion/roles/components/roles-page-list.component').then(m => m.RolesPageListComponent) },
      { path: 'configuracion/permisos', loadComponent: () => import('./modules/configuracion/roles/components/roles-page-list.component').then(m => m.RolesPageListComponent) }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
