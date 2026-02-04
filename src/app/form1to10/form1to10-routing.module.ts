import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Form1 } from './form1/form1';
import { Form2 } from './form2/form2';
import { Form3 } from './form3/form3';
import { Form4 } from './form4/form4';
import { Form5Component } from './form5/form5';
import { Form6 } from './form6/form6';

const routes: Routes = [
  {
    path: 'form1', component: Form1
  },
  {
    path: 'form2', component: Form2
  },
  { path: 'form3', component: Form3 },
  {
    path: 'form4', component: Form4
  }, {
    path: 'form5', component: Form5Component
  },
  {
    path: 'form6', component: Form6
  }



];


export default routes;
