import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListManagementComponent } from './list-management.component';
import { RouterModule, Routes } from '@angular/router';
import { ListDashboardComponent } from './list-dashboard/list-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ListManagementComponent,
    children: [
      { path: '', component: ListDashboardComponent }
    ],
    canActivate: [],
  },
];

@NgModule({
  declarations: [ListManagementComponent, ListDashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class ListManagementModule { }
