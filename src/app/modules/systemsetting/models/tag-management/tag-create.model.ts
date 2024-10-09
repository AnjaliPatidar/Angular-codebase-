export interface TagCreate {
    content: string;
    color_code: string;
    entity_type: string;
    sub_tags: Array<number>;
}