import { MatMenuModule } from '@angular/material/menu';
import { CaseAduitComponent } from './../../../modules/case-management/case-aduit/case-aduit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
/**Angular module imports */
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NgbModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from "ng2-file-upload";
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

/**External module imports */
import { AgGridModule } from 'ag-grid-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NouisliderModule } from 'ng2-nouislider';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
/**User defined module imports */
import { MaterialModule } from '@app/shared/material.module';
import { AlertCommentsModule } from '../alerts-comments/alert-comments.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
/**User defined component imports */
import { AgGridTableComponent } from './ag-grid-table.component';
import { MultiSelectRendererComponentComponent } from './custom-table-renderer/multi-select-renderer-component/multi-select-renderer-component.component';
import { SliderFilterComponent } from './custom-filters/slider-filter/slider-filter.component';
import { SingleSelectFilterComponent } from './custom-filters/single-select-filter/single-select-filter.component';
import { DateFilterComponent } from './custom-filters/date-filter/date-filter.component';
import { MultiSelectFilterComponent } from './custom-filters/multi-select-filter/multi-select-filter.component';
import { SingleSelectRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/single-select-renderer-component/single-select-renderer-component.component';

/**Service imports */
import { AgGridTableService } from './ag-grid-table.service';
import { ColorPickerRendererComponentComponent } from './custom-table-renderer/color-picker-renderer-component/color-picker-renderer-component.component';
import { IndicatorFilterComponent } from './custom-filters/indicator-filter/indicator-filter.component';
import { InputTextRendererComponent } from './custom-table-renderer/input-text-renderer/input-text-renderer.component';
import { AutoCompleteComponent } from './custom-filters/auto-complete/auto-complete.component';
import { ScreeningBatchFileComponent } from './modals/screening-batch-file/screening-batch-file.component';
import { DateRendererComponent } from './custom-table-renderer/date-renderer/date-renderer.component';
import { ReviewerComponent } from './custom-table-renderer/reviewer/reviewer.component';
import { AlertondemandsearchComponent } from './modals/alertondemandsearch/alertondemandsearch.component';
import { GroupAssignmentComponent } from './modals/group-assignment/group-assignment.component';
import { ChipsAutocompleteComponent } from './modals/chips-autocomplete/chips-autocomplete.component';
import { NodbclickDirective } from './nodbclick.directive';
import { CreateCaseManagementComponent } from './modals/create-case-management/create-case-management.component';
import { DatePickerRendererComponent } from './custom-table-renderer/date-picker-renderer/date-picker-renderer.component';
import { CaseDetailInfoComponent } from './modals/case-detail-info/case-detail-info.component';
import { CaseDetailIconsComponent } from './custom-table-renderer/case-detail-icons/case-detail-icons.component';
import { CustomTableRendererComponent } from './custom-table-renderer/custom-table-renderer.component';
import { PipeModuleModule } from '@app/common-modules/pipes/pipe-module/pipe-module.module';
import { ConfirmationmodalComponent } from './custom-table-renderer/case-detail-icons/confirmationmodal/confirmationmodal.component';
import { PersonAlertCardComponent } from '@app/modules/entity/modals/person-alert-card/person-alert-card.component';
import { CommentsSectionComponent } from '@app/common-modules/modules/comments-section/comments-section.component';
import { TextSelectFilterComponent } from './custom-filters/text-select-filter/text-select-filter.component';
import { CaseBatchFileComponent } from './modals/case-batch-file/case-batch-file.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from '@app/shared-services/interceptor.service';
import { DropDownColumnComponent } from './ag-grid-table-column-view/drop-down-column/drop-down-column/drop-down-column.component';
import { DatePipe } from '@angular/common';
import { CommentsComponent } from '@app/modules/comments/comments/comments.component';
import { SingleCommentSectionComponent } from '@app/modules/comments/single-comment-section/single-comment-section.component';
import { RiskOverrideRenderComponent } from './custom-table-renderer/risk-override-render/risk-override-render.component';
import { CaseFileNameComponent } from './custom-table-renderer/case-file-name/case-file-name.component';
import { CaseTagsCellComponent } from './custom-table-renderer/case-tags-cell/case-tags-cell.component';
import { TextFilterComponent } from './custom-filters/text-filter/text-filter.component';
import { CaseRelatedEntityComponent } from './custom-table-renderer/case-related-entity/case-related-entity.component';
import { CaseRelatedEntityCountryComponent } from './custom-table-renderer/case-related-entity-country/case-related-entity-country.component';
import { SearchReleatedEntityComponent } from './modals/search-related-entity/search-related-entity';
import { AssociatedRecordsActionsComponent } from './custom-table-renderer/associated-records-actions/associated-records-actions.component';
import { TmAlertHitsCustomColsModule } from '@app/modules/transaction-monitoring/tm-alert-card/alert-transaction-list/tm-alert-hits-custom-cols/tm-alert-hits-custom-cols.module';
import { RelatedCaseIdComponent } from './custom-table-renderer/relatedCaseId/relatedCaseId.component';
import { CaseAlertCustomerInfoComponent } from './modals/case-alert-customer-info/case-alert-customer-info.component';
import { DocumentRepositoryComponent } from './modals/document-repository/document-repository.component';
import { TooltipRendererComponent } from './custom-table-renderer/tooltip-renderer/tooltip-renderer.component';
import { DocumentCustomTitleComponent } from './custom-table-renderer/document-custom-title/document-custom-title.component';
import { RelatedAlertsModule } from '../related-alerts/related-alerts.module';
import { CaseManagementCaseCellRendererCellNameComponent } from './modals/case-detail-info/cell-renderer-cell-name/cell-renderer-cell-name.component';
import { CaseRiskFlagRendererComponent } from './custom-table-renderer/case-risk-flag-renderer/case-risk-flag-renderer.component';
import { CaseRiskFactorsModule } from '../case-risk-factors/case-risk-factors.module';
import { CellRendererTextComponent } from '@app/common-modules/modules/ag-grid-table/cell-renderers/cell-renderer-text/cell-renderer-text.component';
import { DateTranslatedPipeModule } from '@app/common-modules/pipes/date-translated/date-translated-pipe.module';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { CellRendererDateComponent } from '@app/common-modules/modules/ag-grid-table/cell-renderers/cell-renderer-date/cell-renderer-date.component';
import { CaseManagementCaseCellRendererCellNameWithLoaderComponent } from './modals/case-detail-info/cell-renderer-cell-name-with-loader/cell-renderer-cell-name-with-loader.component';
import { BindCssVariableDirective } from './bind-css-variable.directive';
import { DateTimeColumnComponent } from './cell-renderers/date-time-column/date-time-column.component';
import { ToggleRenderComponent } from './custom-table-renderer/toggle-render/toggle-render.component';
import { EventsLookupComponent } from '@app/common-modules/modules/ag-grid-table/modals/case-detail-info/components/events-lookup.component';
import { CommonConfirmationModalComponent } from './modals/common-confirmation-modal/common-confirmation-modal.component';
import { CustomHeaderColumnComponent } from './cell-renderers/custom-header-column/custom-header-column.component';
import { LazyLoadLibraryService } from '@app/common-modules/services/lazy-load-library.service';
import { EntityApiService } from '@app/modules/entity/services/entity-api.service';
import { EntitySourceModalComponent } from './modals/entity-source-modal/entity-source-modal.component';
import { WidgetsCollapsedContainerComponent } from './widgets-collapsed-container/widgets-collapsed-container.component';


registerLocaleData(localeDe);
registerLocaleData(localeEn);

@NgModule({
  declarations: [
    AgGridTableComponent,
    MultiSelectRendererComponentComponent,
    SliderFilterComponent,
    SingleSelectFilterComponent,
    DateFilterComponent, MultiSelectFilterComponent,
    SingleSelectRendererComponentComponent,
    RelatedCaseIdComponent,
    ColorPickerRendererComponentComponent,
    CustomTableRendererComponent,
    InputTextRendererComponent,
    IndicatorFilterComponent,
    DateRendererComponent,
    AutoCompleteComponent,
    ReviewerComponent,
    ScreeningBatchFileComponent,
    AlertondemandsearchComponent,
    GroupAssignmentComponent,
    ChipsAutocompleteComponent,
    NodbclickDirective,
    CreateCaseManagementComponent,
    DatePickerRendererComponent,
    CaseDetailInfoComponent,
    CaseDetailIconsComponent,
    CommentsSectionComponent,
    ConfirmationmodalComponent,
    PersonAlertCardComponent,
    TextSelectFilterComponent,
    CaseBatchFileComponent,
    DropDownColumnComponent,
    RiskOverrideRenderComponent,
    CommentsComponent,
    SingleCommentSectionComponent,
    RiskOverrideRenderComponent,
    CaseAduitComponent,
    CaseFileNameComponent,
    CaseTagsCellComponent,
    TextFilterComponent,
    CaseRelatedEntityComponent,
    CaseRelatedEntityCountryComponent,
    SearchReleatedEntityComponent,
    AssociatedRecordsActionsComponent,
    CaseAlertCustomerInfoComponent,
    DocumentRepositoryComponent,
    TooltipRendererComponent,
    DocumentRepositoryComponent,
    DocumentCustomTitleComponent,
    CaseManagementCaseCellRendererCellNameComponent,
    CaseRiskFlagRendererComponent,
    CellRendererTextComponent,
    CellRendererDateComponent,
    DateTimeColumnComponent,
    CaseManagementCaseCellRendererCellNameWithLoaderComponent,
    BindCssVariableDirective,
    ToggleRenderComponent,
    EventsLookupComponent,
    CommonConfirmationModalComponent,
    CustomHeaderColumnComponent,
    EntitySourceModalComponent,
    WidgetsCollapsedContainerComponent
  ],
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbAlertModule,
    NgxUiLoaderModule,
    PipeModuleModule,
    AgGridModule.withComponents([AgGridTableComponent]),
    NgMultiSelectDropDownModule.forRoot(),
    NouisliderModule,
    NgxDaterangepickerMd.forRoot(),
    NgxMatSelectSearchModule,
    MaterialModule,
    AlertCommentsModule,
    AutocompleteLibModule,
    TranslateModule,
    FileUploadModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    TmAlertHitsCustomColsModule,
    RelatedAlertsModule,
    CaseRiskFactorsModule,
    DateTranslatedPipeModule,
    NgxSliderModule,
  ],
  exports: [
    AgGridTableComponent,
    DateFilterComponent,
    DateRendererComponent,
    CommentsSectionComponent,
    MatSelectModule,
    SingleSelectRendererComponentComponent,
    RelatedCaseIdComponent,
    CustomTableRendererComponent,
    CaseRelatedEntityComponent,
    WidgetsCollapsedContainerComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    AgGridTableService,
    NgbDropdownConfig,
    DatePipe,
    LazyLoadLibraryService,
    EntityApiService
  ],
  entryComponents: [
    DropDownColumnComponent,
    MultiSelectRendererComponentComponent,
    SliderFilterComponent,
    SingleSelectFilterComponent,
    DateFilterComponent,
    DateRendererComponent,
    MultiSelectFilterComponent,
    ColorPickerRendererComponentComponent,
    InputTextRendererComponent,
    IndicatorFilterComponent,
    AutoCompleteComponent,
    ReviewerComponent,
    ScreeningBatchFileComponent,
    AlertondemandsearchComponent,
    GroupAssignmentComponent,
    ChipsAutocompleteComponent,
    CreateCaseManagementComponent,
    DatePickerRendererComponent,
    CaseDetailInfoComponent,
    CaseDetailIconsComponent,
    CommentsSectionComponent,
    SingleSelectRendererComponentComponent,
    RelatedCaseIdComponent,
    CustomTableRendererComponent,
    ConfirmationmodalComponent,
    PersonAlertCardComponent,
    TextSelectFilterComponent,
    CaseBatchFileComponent,
    CommentsComponent,
    SingleCommentSectionComponent,
    RiskOverrideRenderComponent,
    CaseAduitComponent,
    CaseFileNameComponent,
    CaseTagsCellComponent,
    TextFilterComponent,
    CaseRelatedEntityComponent,
    CaseRelatedEntityCountryComponent,
    SearchReleatedEntityComponent,
    AssociatedRecordsActionsComponent,
    DocumentCustomTitleComponent,
    CaseManagementCaseCellRendererCellNameComponent,
    TooltipRendererComponent,
    CaseRiskFlagRendererComponent,
    CellRendererTextComponent,
    CellRendererDateComponent,
    DateTimeColumnComponent,
    CaseManagementCaseCellRendererCellNameWithLoaderComponent,
    ToggleRenderComponent,
    CommonConfirmationModalComponent,
    CustomHeaderColumnComponent,
    EntitySourceModalComponent,
    WidgetsCollapsedContainerComponent
  ]
})
export class AgGridTableModule { }
