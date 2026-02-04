import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Formt1 } from './formt1/formt1';
import { Formt2 } from './formt2/formt2';

const routes: Routes = [
  {
    path: 'formt1', component: Formt1
  },
  {
    path: 'formt2', component: Formt2
  }



];



export default routes;
