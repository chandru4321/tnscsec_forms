import { Routes } from '@angular/router';
import { Login } from './login/login';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  

  {
    path: 'layout',
    loadChildren: () =>
      import('./layout/layout-routing.module').then(m => m.LayoutRoutingModule)
  },
  {
    path:'forms',
    loadChildren: () =>
      import('./forms/forms-routing.module').then(m => m.formsRoutingModule)
  },

  // If you want direct access
  { path: '**', redirectTo: 'login' }
];
