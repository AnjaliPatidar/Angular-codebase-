import { Component, OnInit, Input } from '@angular/core';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';

@Component({
  selector: 'app-case-alert-customer-info',
  templateUrl: './case-alert-customer-info.component.html',
  styleUrls: ['./case-alert-customer-info.component.sass']
})
export class CaseAlertCustomerInfoComponent implements OnInit {

  public customerInfoData: any = {
    ubos: [],
    legal: [],
    managers: []
  }

  private customerInfoDataOriginal: any = {
    ubo: [],
    legal_rep: [],
    key_managers: []
  }

  public entity_type: string = 'person';

  @Input('customerInfo') set customerInfo(customerInfo: any) {
    this.customerInfoData = {};
    this.entity_type = customerInfo.type;

    if (customerInfo && customerInfo.results) {
      this.customerInfoDataOriginal = customerInfo.results;
      this.customerInfoData.ubos = customerInfo.results.ubo ? this.sliceTheArray(customerInfo.results.ubo) : [];
      this.customerInfoData.legal = customerInfo.results.legal_rep ? this.sliceTheArray(customerInfo.results.legal_rep) : [];
      this.customerInfoData.managers = customerInfo.results.key_managers ? this.sliceTheArray(customerInfo.results.key_managers) : [];
    }
  }
  constructor(private _alertService: AlertManagementService) { }

  ngOnInit() { }

  sliceTheArray(originalArray) {
    let k = 3;
    let arrayToReturn = [];
    for (let i = 0; i < originalArray.length; i += k) {
      arrayToReturn.push({ items: originalArray.slice(i, i + k) });
    }
    return arrayToReturn;
  }

  onEnter(type: string, valueIn: string) {
    let value = valueIn.toLowerCase();
    switch (type) {
      case 'ubos': {
        this.customerInfoData.ubos = this.sliceTheArray(this.customerInfoDataOriginal.ubo.filter(function (c) {
          return (c.name ? c.name.toLowerCase().includes(value) : false)
            || (c.bpkenn ? c.bpkenn.toLowerCase().includes(value) : false);
        }));
        break;
      }
      case 'legal': {
        this.customerInfoData.legal = this.sliceTheArray(this.customerInfoDataOriginal.legal_rep.filter(function (c) {
          return (c.name ? c.name.toLowerCase().includes(value) : false)
            || (c.bpkenn ? c.bpkenn.toLowerCase().includes(value) : false)
            || (c.type ? c.type.toLowerCase().includes(value) : false);
        }));
        break;
      }
      case 'managers': {
        this.customerInfoData.managers = this.sliceTheArray(this.customerInfoDataOriginal.key_managers.filter(function (c) {
          return (c.name ? c.name.toLowerCase().includes(value) : false)
            || (c.bpkenn ? c.bpkenn.toLowerCase().includes(value) : false)
            || (c.type ? c.type.toLowerCase().includes(value) : false);
        }));
        break;
      }
    }
  }
}
