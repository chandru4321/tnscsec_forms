import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { forms } from './forms';

const routes: Routes = [
  {
    path: '',
    component: forms,
    children: [
      { path: 'form1', component: form1} ,
     // {path:'footer', component:Footer}  // content inside layout
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class formsRoutingModule {
  
}
