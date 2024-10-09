import { Component, OnInit } from '@angular/core';
import { CaseRiskFactorsService } from '@app/common-modules/modules/case-risk-factors/case-risk-factors.service';
import { ICellRendererParams } from 'ag-grid-community';

interface IRiskFlagCellRendererParams extends ICellRendererParams {
  value: any[]
}

@Component({
  selector: 'app-case-risk-flag-renderer',
  templateUrl: './case-risk-flag-renderer.component.html',
  styleUrls: ['./case-risk-flag-renderer.component.scss']
})
export class CaseRiskFlagRendererComponent implements OnInit {

  riskFlags: { riskFlag: string, color: string }[];
  riskFlagsToShow = []

  constructor(private caseRiskFactorsService: CaseRiskFactorsService) { }

  ngOnInit() {
  }

  agInit({ flagColors, value }: { flagColors: any[] } & IRiskFlagCellRendererParams) {
    if (value && flagColors) {
      const riskFactors = value && value.length ? value : [];
      this.riskFlags = this.caseRiskFactorsService.getRiskFlagsWithColorsFromFactors(riskFactors, flagColors);
      this.riskFlagsToShow = this.riskFlags && this.riskFlags.length > 2 ? this.riskFlags.slice(0, 2) : this.riskFlags;
    }
  }

  trackByRiskFlag(_, item): string {
    return item.riskFlag;
  }

}
