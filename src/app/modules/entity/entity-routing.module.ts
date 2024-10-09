import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



import { RootComponent } from './components/root/root.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ComplianceComponent } from './components/compliance/compliance.component';
import { LeadershipComponent } from './components/leadership/leadership.component';
import { FinancialComponent } from './components/financial/financial.component';
import { RiskAlertComponent } from './components/risk-alert/risk-alert.component';
import { ThreatsIntelligenceComponent } from './components/threats-intelligence/threats-intelligence.component';
import { LatestNewsComponent } from './components/latest-news/latest-news.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { MediaComponent } from './components/media/media.component';
import { FormAnalysisComponent } from './components/form-analysis/form-analysis.component';
import { RatingIndetailComponent } from './components/rating-indetail/rating-indetail.component';
import { PersonalityComponent } from './components/personality/personality.component';

const routes: Routes = [
  {path:'', component:RootComponent , children :[
    {
      path:'overview',
      component:OverviewComponent
    },
    {
      path:'personality',
      component:PersonalityComponent
    },
    {
      path:'compliance',
      component:ComplianceComponent
    },
    {
      path:'financial',
      component:FinancialComponent
    },
    {
      path:'risk-alerts',
      component:RiskAlertComponent
    },
    {
      path:'leadership',
      component:LeadershipComponent
    },
    {
      path:'threats-intelligence',
      component:ThreatsIntelligenceComponent
    },
    {
      path:'latest-news',
      component:LatestNewsComponent
    },
    {
      path:'social-media',
      component:SocialMediaComponent
    },
    {
      path:'media',
      component:MediaComponent
    },
    {
      path:'form-analysis',
      component:FormAnalysisComponent
    },
    {
      path:'rating',
     component:RatingIndetailComponent
    }


  ]}

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityRoutingModule { }
