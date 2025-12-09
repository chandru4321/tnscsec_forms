import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Logout } from './logout/logout';
import { totalforms } from './totalforms/totalforms';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },

  {
    path: 'layout',
    loadChildren: () =>
      import('./layout/layout-routing.module')
        .then(m => m.default)   // important
  },


  { path: 'logout', component: Logout },

  { path: '**', redirectTo: 'login' },
];



export default routes;




