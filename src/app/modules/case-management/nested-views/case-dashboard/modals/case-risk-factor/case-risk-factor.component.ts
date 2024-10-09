import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-case-risk-factor',
  templateUrl: './case-risk-factor.component.html',
  styleUrls: ['./case-risk-factor.component.scss']
})
export class CaseRiskFactorComponent implements OnInit {
	riskFactors : any;
  currentCaseId: number;
	isLoading: boolean = false;

   constructor(public dialogRef: MatDialogRef<CaseRiskFactorComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public modalservice: NgbModal) {
		if(this.data && this.data.riskFactors){
			this.riskFactors = this.data.riskFactors;
		}
	}

  ngOnInit() {
	  const matDialogConfig = new MatDialogConfig()
    const rect: DOMRect = this.data.positionRelativeToElement.nativeElement.getBoundingClientRect()
	  matDialogConfig.position = { right: `25px`, top: `${rect.bottom + 20}px` }
    this.dialogRef.updatePosition(matDialogConfig.position)
  }

  close(isCancel: boolean = true): void {
    this.dialogRef.close();
  }

  hideAccordian(riskCategory) {
    riskCategory.showCategory = !riskCategory.showCategory;
	}

	getRiskPrecentage(riskFactor) {
    if (riskFactor["Risk Max Threshold"] && riskFactor["Risk Min Threshold"] && riskFactor["Risk value"]) {
			let value = ((parseFloat(riskFactor["Risk value"]) / (parseFloat(riskFactor["Risk Max Threshold"]) - parseFloat(riskFactor["Risk Min Threshold"]))) * 100);
			if (value > 100) {
				value = 100;
			}
			return value.toFixed(2);
		} else {
			return riskFactor["Risk value"] !== 0 ? 100 : 0;
		}

	}

  getColorCodeFromName(riskLevel, isLight:boolean = false):string{
    const opacity = isLight ? .9 : 1
		var colorCode = "";
		if(riskLevel && riskLevel.toLowerCase() == "high") {
			colorCode = "rgba(204, 51, 61, " + opacity + ")";
		} else if(riskLevel && riskLevel.toLowerCase() == "medium") {
			colorCode = "rgba(144,78,202, " + opacity + ")";
		} else if(riskLevel && riskLevel.toLowerCase() == "low") {
			colorCode = "rgba(0, 121, 107, " + opacity + ")";
		} else {
			colorCode = "rgba(204, 51, 61, " + opacity + ")";
		}
		return colorCode;
	}


  isRiskFlagEmpty(riskFactor):boolean{
    return riskFactor && !riskFactor["Risk Flag"] ? true : false;
  }

  isRiskValueZero(riskFactor):boolean{
    return riskFactor && !riskFactor["Risk value"] ? true : false;
  }


}
