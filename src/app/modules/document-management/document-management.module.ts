import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentManagementComponent } from './document-management.component';
import { DocumentDashboardComponent } from './document-dashboard/document-dashboard.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DocumentManagementComponent,
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DocumentDashboardComponent },
      { path: 'dashboard/document-viewer/:id', component: DocumentDashboardComponent },
    ],
    canActivate: [],
  },
];

@NgModule({
  declarations: [DocumentManagementComponent, DocumentDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DocumentManagementModule { }
