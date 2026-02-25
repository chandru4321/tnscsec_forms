import { Routes } from '@angular/router';
import { Layout } from './layout';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';

const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [

      {
        path: 'totalforms',
        loadChildren: () =>
          import('../totalforms/totalforms-routingmodule')
            .then(m => m.default)
      },

      // ✅ ADMIN ROUTE (PUT YOUR CODE HERE)

      {
        path: 'admin-dashboard',
        component: AdminDashboard,
        canActivate: [() => {
          const role = localStorage.getItem('role');
          if (role === 'admin') {
            return true;
          } else {
            window.location.href = '/layout/totalforms';
            return false;
          }
        }]
      },
      {
        path: 'form1to10',
        loadChildren: () =>
          import('../form1to10/form1to10-routing.module')
            .then(m => m.default)
      },
      {
        path: 'admintable',
        loadChildren: () =>
          import('../admintable/admintable.routing.module')
            .then(m => m.default)

      },

      {
        path: 'formtables',
        loadChildren: () =>
          import('../formtables/formtables-routing.module')
            .then(m => m.default)
      },

      { path: '', redirectTo: 'totalforms', pathMatch: 'full' }
    ]
  }
];

export default routes;