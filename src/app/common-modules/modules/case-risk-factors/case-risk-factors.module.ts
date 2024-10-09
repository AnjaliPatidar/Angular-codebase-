import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseRiskFlagsModule } from './case-risk-flags/case-risk-flags.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CaseRiskFlagsModule
  ],
  exports: [
    CaseRiskFlagsModule
  ]
})
export class CaseRiskFactorsModule { }
