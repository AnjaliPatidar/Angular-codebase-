import { CaseEntity } from "./case-entity.model";
import { CaseProduct } from "./case-product.model";
import { CaseStatus } from "./case-status.model";
import { ListData } from "./list-data.model";

export class CaseDetails {
    id: number;
    type: ListData;
    originator: string;
    assignee: {assigned_to : string, group_id: number, screen_name: string};
    status: CaseStatus;
    risk_indicator: ListData;
    risk_override: ListData;
    comment_count: number;
    remediation_date: string;
    name: string;
    priority: ListData;
    created_on: string;
    jurisdiction_code: string;
    modified_on: string;
    modified_by: number;
    modified_person: string;
    products: Array<CaseProduct>;
    region_uplift: ListData;
    status_reasons: Array<string>;
    entity: CaseEntity;
    requested_date: string;
    customer_internal_id: string;
    status_reason_history: string;
    previous_status_reasons: string;
    business_priority: ListData;
    risk_override_reason: string;
    tenant: any;
    risk_score: string;
    risk_flags:any;
    last_status_update: string;
}
