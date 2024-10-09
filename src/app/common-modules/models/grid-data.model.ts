import { PaginationInformation } from "./pagination-information.model";

export class GridData<T> {
    data ?:Array<T>;
    result: Array<T>;
    pagination_information: PaginationInformation;
    paginationInformation: PaginationInformation;
    constructor() {
      this.data = [];
      this.pagination_information = new PaginationInformation();
    }
}
