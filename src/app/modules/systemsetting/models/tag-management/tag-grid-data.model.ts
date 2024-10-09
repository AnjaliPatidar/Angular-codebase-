import { Tag } from "./tag.model";

export class TagGridData {
    tag: Tag;
    sub_tags: Array<Tag>;
    isValid?: boolean;
}
