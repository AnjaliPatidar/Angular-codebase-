import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionMonitoringComponent } from './transaction-monitoring.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridTableModule } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.module';
import { PipeModuleModule } from '@app/common-modules/pipes/pipe-module/pipe-module.module';
import { MyMissingTranslationHandler } from '@app/shared-services/translation.service';
import { MaterialModule } from '@app/shared/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

const routes: Routes = [
  {
    path: '',
    component: TransactionMonitoringComponent,
    children: [
      { path: '', redirectTo: 'alertCard' },
      {
        path: 'alertCard/:alertId',
        loadChildren: () => import('./tm-alert-card/tm-alert-card.module').then(m => m.TmAlertCardModule)
      },
    ],
     canActivate:[]
  }
];

@NgModule({
  declarations: [TransactionMonitoringComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    PipeModuleModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AgGridTableModule,
    HttpClientModule,
    TranslateModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (childTranslateLoader),
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler
      },
      isolate: true
    }),
    MaterialModule
  ]
})
export class TransactionMonitoringModule { }
