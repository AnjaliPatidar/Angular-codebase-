import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertManagementComponent } from './alert-management.component';
import { Routes, RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LeftPanelComponent } from './left-panel/left-panel.component';
import { RightPanelComponent } from './right-panel/right-panel.component';
import { AccViewComponent } from './nested-views/acc-view/acc-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridTableModule } from '../../common-modules/modules/ag-grid-table/ag-grid-table.module';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertsListComponent } from './nested-views/alerts/alerts-list.component';
import { FeedListComponent } from './nested-views/feed/feed-list.component';
import { TopAlertPanelComponent } from './top-alert-panel/top-alert-panel.component';
import { AlertManagementService } from './alert-management.service';
// import { SingleSelectRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/single-select-renderer-component/single-select-renderer-component.component';
// import { CustomTableRendererComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/custom-table-renderer.component';
import { AlertCommentsModule } from '../../common-modules/modules/alerts-comments/alert-comments.module';
import { InputTypeRendererComponentComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/input-type-renderer-component/input-type-renderer-component.component';
import { AutoCompleteComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/auto-complete/auto-complete.component';
import { MaterialModule } from '@app/shared/material.module';
// import { CustomTextFilter } from '@app/common-modules/pipes/textFIlter.component';
// import { TimestampSort } from '../../common-modules/pipes/TimeStampSort.component';
import { TranslateModule, TranslateLoader,MissingTranslationHandler } from '@ngx-translate/core';
import { PipeModuleModule } from '@app/common-modules/pipes/pipe-module/pipe-module.module'
import { permissionsGuardService } from '../rout-guards/auth.service';
import { EntityNameComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/entity-name/entity-name.component';
import { ConfidenceLevelComponent } from '@app/common-modules/modules/ag-grid-table/custom-table-renderer/confidence-level/confidence-level.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MyMissingTranslationHandler } from '../../shared-services/translation.service';

import { LazyLoadLibraryService } from '../../common-modules/services/lazy-load-library.service';
import { InterceptorService } from '@app/shared-services/interceptor.service';
import { DateTranslatedPipeModule } from '@app/common-modules/pipes/date-translated/date-translated-pipe.module';
import { MinimizedPopModalComponent } from '@app/minimized-pop-modal/minimized-pop-modal.component';
import { BindCssVariableDirective } from './directives/bind-css-variable.directive';
import { AlertViewComponent } from './nested-views/alert-view/alert-view.component';
import { AlertMetadataComponent } from './nested-views/alert-metadata/alert-metadata.component';
import { AlertHitDetailsComponent } from './nested-views/alert-hit-details/alert-hit-details.component';
import { AlertEntityDetailsComponent } from './nested-views/alert-entity-details/alert-entity-details.component';
import { CommentListComponent } from './nested-views/common/comment/comment-list/comment-list.component';
import { CommentListItemComponent } from './nested-views/common/comment/comment-list-item/comment-list-item.component';
import { AddCommentComponent } from './nested-views/common/comment/add-comment/add-comment.component';
import { ConfirmationModalComponent } from './nested-views/common/comment/confirmation-modal/confirmation-modal.component';
import { AuditingListComponent } from './nested-views/common/audit-history/auditing-list/auditing-list.component';
import { AuditingListItemComponent } from './nested-views/common/audit-history/auditing-list-item/auditing-list-item.component';
import { AlertHitsFilterModalComponent } from './nested-views/alert-hit-details/alert-hits-filter-modal/alert-hits-filter-modal.component';
import { AlertHitWrapperComponent } from './nested-views/alert-hit-wrapper/alert-hit-wrapper.component';
import { AlertHitInformationComponent } from './nested-views/alert-hit-information/alert-hit-information.component';
import { AlertGeneralInfoComponent } from './nested-views/alert-general-info/alert-general-info.component';
import { AlertWatchlistInfoComponent } from './nested-views/alert-watchlist-info/alert-watchlist-info.component';
import { AlertCustomerInfoComponent } from './nested-views/alert-customer-info/alert-customer-info.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { AlertAdverseMediaComponent } from './nested-views/alert-adverse-media/alert-adverse-media.component';
import { AdverseMediaMetadataComponent } from './nested-views/adverse-media-metadata/adverse-media-metadata.component';
import { AdverseMediaTextHighlightComponent } from './nested-views/adverse-media-text-highlight/adverse-media-text-highlight.component';
import { AdverseMediaFilterComponent } from './nested-views/adverse-media-filter/adverse-media-filter.component';
import {
  BstAlertStatusComponent
} from "@app/modules/alert-management/nested-views/shared/bst-alert-status/bst-alert-status.component";
import { SearchFilterPipe } from './nested-views/adverse-media-filter/search-filter.pipe';

const routes: Routes = [
  {
    path: '',
    component: AlertManagementComponent,
    children: [
      { path: '', redirectTo: 'alertsList' },
      { path: 'alertsList', component: AlertsListComponent },
      { path: 'feedList', component: FeedListComponent },
      { path: 'accordianList', component: AccViewComponent },
      { path: 'alertView', component: AlertViewComponent },
      { path: 'alertView/:uuid', component: AlertViewComponent,}
    ],
    canActivate:[permissionsGuardService]
  },
  {
    path: '',
    component: AlertManagementComponent,
    children: [
      { path: 'alertsList/alertCard/:alertId/:customerId/:entityId/:cid/:eid', component: AlertsListComponent },
    ]
  }
];

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    AlertManagementComponent,
    LeftPanelComponent,
    RightPanelComponent,
    AccViewComponent,
    AlertsListComponent,
    FeedListComponent,
    TopAlertPanelComponent,
    // SingleSelectRendererComponentComponent,
    EntityNameComponent,
    ConfidenceLevelComponent,
    // CustomTableRendererComponent,
    InputTypeRendererComponentComponent,
    AutoCompleteComponent,
    MinimizedPopModalComponent,
    BindCssVariableDirective,
    AlertViewComponent,
    AlertMetadataComponent,
    AlertHitDetailsComponent,
    AlertEntityDetailsComponent,
    CommentListComponent,
    CommentListItemComponent,
    AddCommentComponent,
    ConfirmationModalComponent,
    AuditingListComponent,
    AuditingListItemComponent,
    AlertHitsFilterModalComponent,
    AlertHitWrapperComponent,
    AlertHitInformationComponent,
    AlertGeneralInfoComponent,
    AlertWatchlistInfoComponent,
    AlertCustomerInfoComponent,
    AlertAdverseMediaComponent,
    AdverseMediaMetadataComponent,
    AdverseMediaTextHighlightComponent,
    AdverseMediaFilterComponent,
    // CustomTextFilter,
    // TimestampSort
    BstAlertStatusComponent,
    SearchFilterPipe
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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (childTranslateLoader),
                deps: [HttpClient],
            },
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: MyMissingTranslationHandler,
            },
            isolate: true,
        }),
        AlertCommentsModule,
        MaterialModule,
        DateTranslatedPipeModule,
        MatFormFieldModule,
        MatInputModule
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    AlertManagementService,
    LazyLoadLibraryService
  ],
  entryComponents: [
    // SingleSelectRendererComponentComponent,
    // CustomTableRendererComponent,
    AutoCompleteComponent,
    RightPanelComponent,
    EntityNameComponent,
    ConfidenceLevelComponent,
    ConfirmationModalComponent,
    AlertHitsFilterModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AlertManagementModule { }
