export class CaseCreateRequest {
    name: string;
    priority?: number;
    customer_internal_id: string;
    type: string;
    risk?: number;
    entity_id: string;
    comment?: string;
    originator: string;
    requested_date?: string;
    entity_url: string;
    jurisdiction_code: string;
    region_uplift?: number;
    products?: Array<number>;
    entity_info: string;
    country: string;
    address: string;
    type_of_relation: number;
    entity_name: string;
    entity_type: string;
    tenant?: number;
}
