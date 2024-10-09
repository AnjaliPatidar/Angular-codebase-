import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertCustomerDetailsComponent } from './alert-customer-details/alert-customer-details.component';
import { AlertEventsComponent } from './alert-events/alert-events.component';
import { AlertSummaryCardComponent } from './alert-summary-card/alert-summary-card.component';
import { AlertTransactionListComponent } from './alert-transaction-list/alert-transaction-list.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgGridTableModule } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.module';
import { HitTransactionListComponent } from './hit-transaction-list/hit-transaction-list.component';

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

const routes: Routes = [
  {
    path: '',
    component: AlertEventsComponent,
     canActivate:[]
  }
];

@NgModule({
  declarations: [
    AlertEventsComponent,
    AlertSummaryCardComponent,
    AlertCustomerDetailsComponent,
    AlertTransactionListComponent,
    HitTransactionListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridTableModule,
    HttpClientModule,
    TranslateModule
  ],
  exports: [],
  entryComponents: [HitTransactionListComponent]
})
export class TmAlertCardModule { }
