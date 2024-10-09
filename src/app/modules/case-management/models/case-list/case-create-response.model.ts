import { CaseProduct } from "./case-product.model";

export class CaseCreateResponse {
    id: number;
    entity_id: string;
    type: string;
    originator: string;
    assignee: string;
    status: string;
    risk_indicators: string;
    comment_count: number;
    remediation_date: null;
    name: string;
    priority: string;
    created_date: string;
    entity_url: string;
    jurisdiction_code: string;
    status_key: string;
    attachments_count: number;
    modified_on: null;
    products: Array<CaseProduct>;
    reason: Array<number>;
    entity_info: string;
}