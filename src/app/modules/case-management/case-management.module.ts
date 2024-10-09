import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridTableModule } from '../../common-modules/modules/ag-grid-table/ag-grid-table.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CaseManagementComponent } from './case-management.component';
import { TopCasePanelComponent } from './top-case-panel/top-case-panel.component';
import { LeftCasePanelComponent } from './left-case-panel/left-case-panel.component';
import { CaseListComponent } from './nested-views/case-list/case-list.component';
import { Routes, RouterModule } from '@angular/router';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MaterialModule } from '@app/shared/material.module';
import { CaseDashboardComponent } from './nested-views/case-dashboard/case-dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyMissingTranslationHandler } from '../../shared-services/translation.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CaseWidgetDeleteComponent } from './nested-views/case-dashboard/modals/widget-delete/case-widget-delete.component';
import { CaseRiskOverrideHistoryComponent } from './nested-views/case-dashboard/modals/case-risk-override-history/case-risk-override-history.component';
import { CaseRiskFactorComponent } from './nested-views/case-dashboard/modals/case-risk-factor/case-risk-factor.component';
import { CaseRiskOverrideComponent } from './nested-views/case-dashboard/modals/case-risk-override/case-risk-override.component';
import { ConfirmaionmodalComponent } from '../systemsetting/modals/confirmaionmodal/confirmaionmodal.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CaseDetailInfoComponent } from '@app/common-modules/modules/ag-grid-table/modals/case-detail-info/case-detail-info.component';
import { CaseBatchMinimizedComponent } from '@app/common-modules/modules/ag-grid-table/modals/case-batch-minimized/case-batch-minimized.component';

const routes: Routes = [
  {
    path: '',
    component: CaseManagementComponent,
    children: [
      { path: '', redirectTo: 'caseDashboard' },
      { path: 'caseDashboard', component: CaseDashboardComponent },
      { path: 'caseList', component: CaseListComponent },
      { path: 'case/:id', component: CaseDetailInfoComponent },
    ],
    canActivate: [],
  },
];

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    CaseManagementComponent,
    TopCasePanelComponent,
    LeftCasePanelComponent,
    CaseListComponent,
    CaseDashboardComponent,
    CaseWidgetDeleteComponent,
    CaseRiskOverrideHistoryComponent,
    CaseRiskOverrideComponent,
    ConfirmaionmodalComponent,
    CaseBatchMinimizedComponent,
    CaseRiskFactorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatSliderModule,
    FormsModule,
    TranslateModule,
    AgGridTableModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: childTranslateLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler,
      },
      isolate: true,
    }),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  entryComponents: [
    CaseWidgetDeleteComponent,
    CaseRiskOverrideHistoryComponent,
    CaseRiskOverrideComponent,
    ConfirmaionmodalComponent,
    CaseRiskFactorComponent,
  ],
})
export class CaseManagementModule { }
