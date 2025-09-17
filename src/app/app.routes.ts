import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/usuarios',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/usuario/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'usuarios/novo',
    loadComponent: () => import('./features/usuario/usuario-form/usuario-form.component').then(m => m.UsuarioFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'usuarios/:id',
    loadComponent: () => import('./features/usuario/usuario-detail/usuario-detail.component').then(m => m.UsuarioDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./features/usuario/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/usuarios'
  }
];



