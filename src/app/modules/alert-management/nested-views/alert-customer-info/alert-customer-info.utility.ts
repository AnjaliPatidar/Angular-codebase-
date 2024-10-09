import { AlertCustomerInfoTypes } from "./alert-customer-info.types";
export namespace AlertCustomerInfoUtility {

  export function mapShareholders(data: Array<any>): Array<AlertCustomerInfoTypes.Shareholders> {
    const shareholdersList = [];

    if (typeof data === "object" && data.length > 0) {
      data.forEach((result: any) => {
        let shareholder: AlertCustomerInfoTypes.Shareholders = {} as AlertCustomerInfoTypes.Shareholders;

        let con = (result["relation"].totalPercentage ? Math.trunc(result["relation"].totalPercentage) : 0);

          (shareholder.name = result["vcard:organization-name"] ? result["vcard:organization-name"] : ''),
          (shareholder.country = result["isDomiciledIn"] ? result["isDomiciledIn"] : ''),
          (shareholder.address = result["mdaas:RegisteredAddress"].fullAddress ? result["mdaas:RegisteredAddress"].fullAddress : ''),
          (shareholder.relationship = result["relation"].source ? result["relation"].source : ''),
          (shareholder.confidence = con.toString() + '%')

          shareholdersList.push(shareholder);
      });
    }
    return shareholdersList;
  }

  export function mapOfficership(data: Array<any>): Array<AlertCustomerInfoTypes.Officership> {
    const officershipList = [];

    if (typeof data === "object" && data.length > 0) {
      data.forEach((result: any) => {
        let officership: AlertCustomerInfoTypes.Officership = {} as AlertCustomerInfoTypes.Officership;

          (officership.name = result["name"] ? result["name"] : ''),
          (officership.address = result["address"].fullAddress ? result["address"].fullAddress : ''),
          (officership.role = result["officer_role"] ? result["officer_role"] : '')

          officershipList.push(officership);
      });
    }
    return officershipList;
  }

}
