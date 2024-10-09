import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponentComponent } from './pageNotFoundComponent/page-not-found-component.component';
import {MainScreenComponent} from '@app/main-screen/main-screen.component';
import {LoginScreenComponent} from '@app/modules/login-screen/login-screen.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginScreenComponent,
  },
  {
    path: 'element',
    component: MainScreenComponent,
    children: [
      {
        path: 'domain',
        loadChildren: () => import('./common-modules/modules/domain/domain.module').then(m => m.DomainModule)
      },
      {
        path: 'submenu',
        loadChildren: () => import('./common-modules/modules/sub-menu/submenu.module').then(m => m.SubmenuModule)
      },
      {
        path: 'process',
        loadChildren: () => import('./common-modules/modules/process/process.module').then(m => m.ProcessModule)
      },
      {
        path: 'toppannel',
        loadChildren: () => import('./common-modules/modules/top-pannel/top-pannel.module').then(m => m.TopPannelModule)
      },
      {
        path: 'entity',
        loadChildren: () => import('./modules/entity/entity.module').then(m => m.EntityModule)
      },
      {
        path: 'sourceManagement',
        loadChildren: () => import('./modules/source-management/source-management.module').then(m => m.SourceManagementModule)
      },
      {
        path: 'alert-management',
        loadChildren: () => import('./modules/alert-management/alert-management.module').then(m => m.AlertManagementModule)
      },
      {
        path: 'system-monitoring',
        loadChildren: () => import('./modules/system-monitoring/system-monitoring.module').then(m => m.SystemMonitoringModule)

      },
      {
        path:'user-management',
        loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule)
      },
      {
        path:'case-management',
        loadChildren: () => import('./modules/case-management/case-management.module').then(m => m.CaseManagementModule)
      },
      {
        path:'systemSettings',
        loadChildren: () => import('./modules/systemsetting/systemsetting.module').then(m => m.SystemsettingModule)
      },
      {
        path:'newSourceManagement',
        loadChildren: () => import('./modules/new-source-management/source-management.module').then(m => m.SourceManagementModule)
      },
      {
        path: 'document-management',
        loadChildren: () => import('./modules/document-management/document-management.module').then(m => m.DocumentManagementModule)
      },
      {
        path: 'list-management',
        loadChildren: () => import('./modules/list-management/list-management.module').then(m => m.ListManagementModule)
      },
      {
        path: 'transaction-monitoring',
        loadChildren: () => import('./modules/transaction-monitoring/transaction-monitoring.module').then(m => m.TransactionMonitoringModule)
      },
      { path: 'forbidden', component:ForbiddenComponent},
      { path: '**', component:PageNotFoundComponentComponent}
]
},
{ path: '', redirectTo: 'element/alert-management/alertsList', pathMatch: 'full'},
{ path: '**', component:PageNotFoundComponentComponent}

];

@NgModule({
imports: [RouterModule.forRoot(routes, { useHash: true })],
exports: [RouterModule]
})
export class AppRoutingModule { }