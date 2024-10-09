export class CaseOverrideRequest {
    case_id: any;
    reason: string;
    old_risk: number;
    new_risk: number;
    override_risk: string;
    case_risk_id?: number;
}