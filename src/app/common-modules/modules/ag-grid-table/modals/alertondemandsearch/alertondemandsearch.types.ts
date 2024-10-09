export namespace AlertOnDemandSearchTypes {
  export interface TenantType {
    listItemId: number;
    code: string;
    displayName: string;
    icon: string;
    allowDelete: boolean;
    listType: string;
    colorCode: string;
    flagName: string;
    file_id: null | string;
    selected: boolean
  }

  export interface TenantTypeRes {
    responseMessage: string;
    status: string;
    data: TenantType[];
    title: string
  }
}