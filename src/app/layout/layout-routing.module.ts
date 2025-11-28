import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './layout';
import { Header } from './header/header';
import { Footer } from './footer/footer';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: 'header', component: Header} ,
      {path:'footer', component:Footer}  // content inside layout
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {
  
}
