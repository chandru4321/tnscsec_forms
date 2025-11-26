import { Routes } from '@angular/router';
import {  Login } from './login/login';
import { Forms } from './forms/forms';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },


   {
        path:'login', component:Login
    },
    {
      path:'forms', component:Forms
    }
];





































































































  