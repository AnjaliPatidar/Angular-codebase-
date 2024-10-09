import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SystemsettingComponent } from './systemsetting.component';
import { GeneralSettingsApiService } from './services/generalsettings.api.service';
import { InterceptorService } from '../../shared-services/interceptor.service';
import { NgbPaginationModule, NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LogomodalComponent } from './modals/logomodal/logomodal.component';
import { EnableAndDisableAlertmodalComponent } from './modals/enable-and-disable-alertmodal/enable-and-disable-alertmodal.component';
import { ConfirmaionmodalComponent } from './modals/confirmaionmodal/confirmaionmodal.component';
import { ConfirmationEditEntityworkflowsComponent } from './modals/confirmationEditEntityworkflows/confirmationEditEntityworkflows.component';
import { FileUploadModule } from "ng2-file-upload";
import { UploadCSVComponent } from './modals/upload-csv/upload-csv.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateLoader, MissingTranslationHandler } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyMissingTranslationHandler } from '../../shared-services/translation.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MaterialModule } from '@app/shared/material.module';
import { ReportFooterModalComponent } from './modals/report-footer-modal/report-footer-modal.component';
import { QuillModule } from 'ngx-quill'
import { AgGridTableModule } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.module';
import { TagColumnComponent } from './components/tag-column/tag-column.component';
import { SubTagsColumnComponent } from './components/sub-tags-column/sub-tags-column.component';
import { TagActionColumnComponent } from './components/tag-action-column/tag-action-column.component';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorPhotoshopModule } from 'ngx-color/photoshop';
import { CollorPickerComponent } from './components/collor-picker/collor-picker.component';
import { AgGridModule } from 'ag-grid-angular';
import { ThemeManagementComponent } from './components/theme-management/theme-management.component';

const routes: Routes = [{
  path: '',
  component: SystemsettingComponent,
}, {
  path: 'theme-builder',
  loadChildren: () => import('./components/theme-builder/theme-builder.module').then(m => m.ThemeBuilderModule)
}];

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    SystemsettingComponent,
    LogomodalComponent,
    EnableAndDisableAlertmodalComponent,
    ConfirmaionmodalComponent,
    ConfirmationEditEntityworkflowsComponent,
    UploadCSVComponent,
    ReportFooterModalComponent,
    TagColumnComponent,
    SubTagsColumnComponent,
    TagActionColumnComponent,
    CollorPickerComponent,
    ThemeManagementComponent
  ],
  exports : [CollorPickerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
    NgbAlertModule,
    NgbModule.forRoot(),
    FormsModule,
    FileUploadModule,
    MatSliderModule,
    MatMenuModule,
    MatIconModule,
    MatSelectModule,
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
    MatAutocompleteModule,
    MatChipsModule,
    ReactiveFormsModule,
    MaterialModule,
    QuillModule.forRoot(),
    AgGridTableModule,
    ColorSketchModule,
    ColorPhotoshopModule,
    AgGridModule.withComponents([
    ])
  ],
  providers: [
    GeneralSettingsApiService,
    InterceptorService
  ],
  entryComponents: [
    LogomodalComponent,
    EnableAndDisableAlertmodalComponent,
    ConfirmaionmodalComponent,
    ConfirmationEditEntityworkflowsComponent,
    UploadCSVComponent,
    ReportFooterModalComponent,
    TagColumnComponent,
    SubTagsColumnComponent,
    TagActionColumnComponent,
  ]
})
export class SystemsettingModule { }
