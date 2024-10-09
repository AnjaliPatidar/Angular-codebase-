import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceManagementComponent as SourceManagementComponent } from './source-management.component';
import { Routes, RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridTableModule } from '../../common-modules/modules/ag-grid-table/ag-grid-table.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SourceListComponent } from './sm-list/sm-list.component';
import { SourceManagementService } from './source-management.service';
import { MaterialModule } from '@app/shared/material.module';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { PipeModuleModule } from '@app/common-modules/pipes/pipe-module/pipe-module.module'
import { permissionsGuardService } from '../rout-guards/auth.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyMissingTranslationHandler } from '../../shared-services/translation.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DynamicHeadersRendererComponent } from './dynamic-headers/dynamic-headers-renderer.component';

const routes: Routes = [
  {
    path: '',
    component: SourceManagementComponent,
    children: [
      { path: '', redirectTo: 'smList' },
      { path: 'smList', component: SourceListComponent },
    ],
    canActivate: [permissionsGuardService]
  }
];

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    SourceManagementComponent,
    LeftPanelComponent,
    DynamicHeadersRendererComponent,
    SourceListComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    PipeModuleModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AgGridTableModule,
    HttpClientModule,
    AngularMultiSelectModule,
    NgMultiSelectDropDownModule.forRoot(),
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
  ],
  providers: [
    SourceManagementService
  ],
  entryComponents: [DynamicHeadersRendererComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SourceManagementModule { }
