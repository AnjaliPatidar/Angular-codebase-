import { ElementRef } from "@angular/core";

export class CaseOverrideHistoryDialog {
    caseId: string;
    riskIndicatorId: string;
    positionRelativeToElement: ElementRef;
    caseRisks: any;
    fistOnly?: boolean;
    editStatus?: boolean;
}