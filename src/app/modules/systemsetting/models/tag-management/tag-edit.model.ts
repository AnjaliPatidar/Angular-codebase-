export interface TagEdit {
    id: number;
    content: string;
    color_code: string;
    entity_type: string;
    added_sub_tags: Array<number>;
    deleted_sub_tags: Array<number>;
}