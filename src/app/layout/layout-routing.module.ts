import { Routes } from '@angular/router';
import { Layout } from './layout';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [

      // All pages INSIDE layout
      {
        path: 'totalforms',
        loadChildren: () =>
          import('../totalforms/totalforms-routingmodule')
            .then(m => m.default)
      },

      {
        path: 'form1to10',
        loadChildren: () =>
          import('../form1to10/form1to10-routing.module')
            .then(m => m.default)
      },
      {
        path: 'formtables',
        loadChildren: () =>
          import('../formtables/formtables-routing.module')
            .then(m => m.default)
      },
      {
        path: 'form1to10edit',
        loadChildren: () =>
          import('../form1to10edit/form1to10edit-routing.module')
            .then(m => m.default)
      },

      // Default child
      { path: '', redirectTo: 'totalforms', pathMatch: 'full' }
    ]
  }
];

export default routes;
