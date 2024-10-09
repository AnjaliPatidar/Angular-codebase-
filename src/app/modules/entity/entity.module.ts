import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { EntityRoutingModule } from './entity-routing.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { AgGridTableModule } from '../../common-modules/modules/ag-grid-table/ag-grid-table.module';
import { MatTabsModule } from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';



import { OverviewComponent } from './components/overview/overview.component';
import { ComplianceComponent } from './components/compliance/compliance.component';
import { RootComponent } from './components/root/root.component';
import { FinancialComponent } from './components/financial/financial.component';
import { FormAnalysisComponent } from './components/form-analysis/form-analysis.component';
import { LatestNewsComponent } from './components/latest-news/latest-news.component';
import { LeadershipComponent } from './components/leadership/leadership.component';
import { MediaComponent } from './components/media/media.component';
import { RiskAlertComponent } from './components/risk-alert/risk-alert.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { ThreatsIntelligenceComponent } from './components/threats-intelligence/threats-intelligence.component';

import { EntityApiService } from '../entity/services/entity-api.service';
import { EntityCommonTabService } from '../entity/services/entity-common-tab.service';
import { EntityFunctionService } from '../entity/services/entity-functions.service';
import { InterceptorService } from '../../shared-services/interceptor.service';
import { EntityOrgchartService } from '../entity/services/entity-orgchart.service';

import { FinanceRightpanelComponent } from './components/financial/finance-rightpanel/finance-rightpanel.component';
import { OverviewRightpanelComponent } from './components/overview/overview-rightpanel/overview-rightpanel.component';
import { LeadershipRightpanelComponent } from './components/leadership/leadership-rightpanel/leadership-rightpanel.component';
import { RiskalertRightpanelComponent } from './components/risk-alert/riskalert-rightpanel/riskalert-rightpanel.component';
import { ThreatsRightpanelComponent } from './components/threats-intelligence/threats-rightpanel/threats-rightpanel.component';
import { SocialmediaRightpanelComponent } from './components/social-media/socialmedia-rightpanel/socialmedia-rightpanel.component';
import { LatestnewsRightpanelComponent } from './components/latest-news/latestnews-rightpanel/latestnews-rightpanel.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';



import { ScreeningbadgeDirective } from '../../common-modules/directives/screeningbadge.directive';
import { ngShowDirective } from '../../common-modules/directives/ng-show.directive';
import { EnityEditComponent } from './modals/enity-edit/enity-edit.component';
import { CompanyInfoComponent } from './components/compliance/company-info/company-info.component';
import { CompanyInfoEditComponent } from './modals/company-info-edit/company-info-edit.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
// import { DocumentsComponent } from './components/compliance/documents/documents.component';
import { AddNewEntityComponent } from './modals/add-new-entity/add-new-entity.component';
import { GenerateReportComponent } from './components/compliance/generate-report/generate-report.component';
import { GraphchangesourceconfirmationComponent } from './modals/graphchangesourceconfirmation/graphchangesourceconfirmation.component';
import { EntityClipboardComponent } from './modals/entity-clipboard/entity-clipboard.component';
import { AddMediaModalComponent } from './modals/add-media-modal/add-media-modal.component';
import { GetNotesNameModalComponent } from './modals/get-notes-name-modal/get-notes-name-modal.component'
import { EntityShareHolderEvidenceModalComponent } from './modals/entity-share-holder-evidence-modal/entity-share-holder-evidence-modal.component';
import { ManagerComponent } from './components/compliance/manager/manager.component';
import { SimilarCompaniesComponent } from './components/compliance/similar-companies/similar-companies.component';
import { RatingComponent } from './components/rating/rating.component';
import { RatingModule } from 'ngx-rating';
import { TooltipModule } from 'ng2-tooltip-directive';
import { RatingIndetailComponent } from './components/rating-indetail/rating-indetail.component';
import { AmenitiesComponent } from './components/compliance/amenities/amenities.component';
import { PipeModuleModule } from '@app/common-modules/pipes/pipe-module/pipe-module.module';
import { NearbyCompaniesComponent } from './components/compliance/nearby-companies/nearby-companies.component';
import { LocationHoursComponent } from './components/compliance/location-hours/location-hours.component';
import { TimelinepopmodalComponent } from './modals/timelinepopmodal/timelinepopmodal.component';
import { MediaRightpanelComponent } from './components/media/media-rightpanel/media-rightpanel.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {LazyLoadLibraryService} from '../../common-modules/services/lazy-load-library.service';
import { PersonInfoEditComponent } from './modals/person-info-edit/person-info-edit.component';
import { RelationMapComponent } from './components/overview/relation-map/relation-map.component';
import { NgCytoComponent } from './components/overview/relation-map/ng-cyto.component';
import { HomeLocationMapComponent } from './components/overview/home-location-map/home-location-map.component';
import { RecommendationsComponent } from './components/overview/recommendations/recommendations.component';
import { PersonalityComponent } from './components/personality/personality.component';
import { AccomplishmentsComponent } from './components/personality/accomplishments/accomplishments.component';
import { SkillsComponent } from './components/personality/skills/skills.component';
import { InterestsComponent } from './components/personality/interests/interests.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { EntityClipboardModule } from './modals/entity-clipboard/entity-clipboard.module';

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}


@NgModule({
  declarations: [
    OverviewComponent,
    ComplianceComponent,
    RootComponent,
    FinancialComponent,
    FormAnalysisComponent,
    LatestNewsComponent,
    LeadershipComponent,
    MediaComponent,
    RiskAlertComponent,
    SocialMediaComponent,
    ThreatsIntelligenceComponent,
    FinanceRightpanelComponent,
    OverviewRightpanelComponent,
    LeadershipRightpanelComponent,
    RiskalertRightpanelComponent,
    ThreatsRightpanelComponent,
    SocialmediaRightpanelComponent,
    LatestnewsRightpanelComponent,
    ScreeningbadgeDirective,
    ngShowDirective,
    EnityEditComponent,
    CompanyInfoComponent,
    CompanyInfoEditComponent,
    // DocumentsComponent,
    AddNewEntityComponent,
    GenerateReportComponent,
    GraphchangesourceconfirmationComponent,
    AddMediaModalComponent,
    GetNotesNameModalComponent,
    EntityShareHolderEvidenceModalComponent,
    ManagerComponent,
    SimilarCompaniesComponent,
    RatingComponent,
    RatingIndetailComponent,
    AmenitiesComponent,
    NearbyCompaniesComponent,
    LocationHoursComponent,
    TimelinepopmodalComponent,
    MediaRightpanelComponent,
    PersonInfoEditComponent,
    RelationMapComponent,
    NgCytoComponent,
    HomeLocationMapComponent,
    RecommendationsComponent,
    PersonalityComponent,
    AccomplishmentsComponent,
    SkillsComponent,
    InterestsComponent,
  ],
  imports: [
    EntityClipboardModule,
    AgGridTableModule,
    CommonModule,
    MatTabsModule,
    HttpClientModule,
    EntityRoutingModule,
    FormsModule,
    NgxSliderModule,
    ReactiveFormsModule,
    NgbModule,
    MalihuScrollbarModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    RatingModule,
    TooltipModule,
    PipeModuleModule,
    MatTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: childTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    EntityApiService,
    EntityFunctionService,
    EntityCommonTabService,
    NgbTabset,
    EntityOrgchartService,
    LazyLoadLibraryService,
  ],
  entryComponents: [
    EnityEditComponent,
    AddNewEntityComponent,
    GraphchangesourceconfirmationComponent,
    EntityClipboardComponent,
    AddMediaModalComponent,
    GetNotesNameModalComponent,
    EntityShareHolderEvidenceModalComponent,
    TimelinepopmodalComponent,
    PersonInfoEditComponent,
    CompanyInfoEditComponent,
  ],
})
export class EntityModule {}
