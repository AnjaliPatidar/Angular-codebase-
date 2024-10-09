export interface IFloatingSingleFilterParams {
  colId: string;
  options: Array<IUsersSelectFilterList | IBaseSelectFilterListOption>;
}

export interface IUsersSelectFilterList extends IBaseSelectFilterListOption {
  screenName?: string;
  userId?: string;
}

export interface IBaseSelectFilterListOption {
  label: string;
  value?: string | number;
  icon?: string;
  color?: string;
  code?: string;
  listItemId?: string;
}
