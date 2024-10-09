import { ElementRef } from "@angular/core";

export class CaseOverrideDialog {
    caseId: string;
    caseRiskOldId: number;
    caseRiskOld: string;
    caseRiskNewId: number;
    caseRiskNew: number;
    positionRelativeToElement: ElementRef;
    caseName:string;
}
