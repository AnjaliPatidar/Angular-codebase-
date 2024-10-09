import { RelatedCaseData } from "./related-case-data.model";
export class RelatedCase {
    name: string;
    case_id: number;
    risk: RelatedCaseData;
    status: string;
    type: RelatedCaseData;
    assignee: {
        icon: string;
        screen_name: string;
    };
    due_date: string;
    priority: RelatedCaseData;
    case_business_priority: RelatedCaseData;
    jurisdiction_code: string;
    user_group: any;
    products: any;
}
