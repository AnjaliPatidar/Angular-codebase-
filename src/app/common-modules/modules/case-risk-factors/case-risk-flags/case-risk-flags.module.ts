import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseRiskFlagItemComponent } from './case-risk-flag-item/case-risk-flag-item.component';



@NgModule({
  declarations: [CaseRiskFlagItemComponent],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    CaseRiskFlagItemComponent
  ],
  entryComponents: [

  ]
})
export class CaseRiskFlagsModule { }
