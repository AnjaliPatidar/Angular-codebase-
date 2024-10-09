export class AssociatedRecord {
    record_id: number;
    record_type: string;
    record_subject_type: string;
    record_subject_name: string;
    record_subject_number: string;
    highlights: string;
    insights: {
        name: string;
        value: string;
    };
    score: number;
    create_date: string;
    alert_type: string;
}