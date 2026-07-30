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
      { path: 'configuracion/permisos', redirectTo: 'configuracion/roles', pathMatch: 'full' },

      // TABLAS AUXILIARES
      { path: 'configuracion/paises', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/paises-page.component').then(m => m.PaisesPageComponent) },
      { path: 'configuracion/provincias', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/provincias-page.component').then(m => m.ProvinciasPageComponent) },
      { path: 'configuracion/ubicaciones', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/ubicaciones-page.component').then(m => m.UbicacionesPageComponent) },
      { path: 'configuracion/zonas', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/zonas-page.component').then(m => m.ZonasPageComponent) },
      { path: 'configuracion/colegios', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/colegios-page.component').then(m => m.ColegiosPageComponent) },
      { path: 'configuracion/categorias', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/categorias-page.component').then(m => m.CategoriasPageComponent) },
      { path: 'configuracion/patologias', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/patologias-page.component').then(m => m.PatologiasPageComponent) },
      { path: 'configuracion/especialidades', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/especialidades-page.component').then(m => m.EspecialidadesPageComponent) },
      { path: 'configuracion/observaciones', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/observaciones-page.component').then(m => m.ObservacionesPageComponent) },
      { path: 'configuracion/vinculos', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/vinculos-page.component').then(m => m.VinculosPageComponent) },
      { path: 'configuracion/periodos', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/periodos-page.component').then(m => m.PeriodosPageComponent) },
      { path: 'configuracion/droguerias', loadComponent: () => import('./modules/configuracion/tablas-auxiliares/pages/droguerias-page.component').then(m => m.DrogueriasPageComponent) },

      // GESTIÓN MÉDICA
      { path: 'gestion-medica/afiliados', loadComponent: () => import('./modules/gestion-medica/afiliados/pages/afiliados-page.component').then(m => m.AfiliadosPageComponent) },
      { path: 'gestion-medica/medicos', loadComponent: () => import('./modules/gestion-medica/medicos/pages/medicos-page.component').then(m => m.MedicosPageComponent) }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
