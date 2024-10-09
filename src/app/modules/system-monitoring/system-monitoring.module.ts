import {CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemMonitoringComponent } from './system-monitoring.component';
import { RouterModule, Routes } from '@angular/router';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { SourcesComponent } from './nested-views/sources/sources.component';
import { HomeComponent } from './nested-views/home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridTableModule } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.module';
import { SourceConstant } from './constants/sources.constant';
import { IconsRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/icons-renderer/icons-renderer.component';
import { MatSelectModule } from '@angular/material/select';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { TranslateModule, TranslateLoader,MissingTranslationHandler } from '@ngx-translate/core';
import {permissionsGuardService} from '../rout-guards/auth.service';
import { MaterialModule } from '@app/shared/material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyMissingTranslationHandler } from '../../shared-services/translation.service';

const routes: Routes = [
  {
    path: '',
    component: SystemMonitoringComponent,
    children: [
      { path: '', redirectTo: 'sources' },
      { path: 'sources', component: SourcesComponent },
      { path: 'home', component: HomeComponent }
      // {path: 'accordianList', component: AccViewComponent}
    ],
    canActivate:[permissionsGuardService]
  }
];

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    SystemMonitoringComponent,
    LeftPanelComponent,
    RightPanelComponent,
    SourcesComponent,
    HomeComponent,
    IconsRendererComponent
  ],
  imports: [
    CommonModule, TranslateModule, RouterModule.forChild(routes), AgGridTableModule, NgbModule, MatSelectModule,MaterialModule , MalihuScrollbarModule.forRoot(),
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
  ],
  providers: [
    SourceConstant
  ],
  entryComponents: [
    IconsRendererComponent
  ]
  ,
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class SystemMonitoringModule { }
