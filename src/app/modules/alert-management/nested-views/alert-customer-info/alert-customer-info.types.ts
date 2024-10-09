export namespace AlertCustomerInfoTypes {

  export type Shareholders = {
    name: string;
    country: string;
    address: string;
    relationship: string;
    confidence: string;
  };

  export type Officership = {
    name: string;
    address: string;
    role: string;
  };
}
