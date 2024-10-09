import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-related-entity-country',
  templateUrl: './case-related-entity-country.component.html',
  styleUrls: ['./case-related-entity-country.component.scss']
})
export class CaseRelatedEntityCountryComponent implements OnInit {

  countryList: any = [];
  value: string;
  countryName: string;

  constructor() { }

  ngOnInit() {
  }

  agInit(params: any) {
    if (params && params.data) {
      this.countryList = params.colDef.countryList;
      if (params.value) {
        this.value = (params.value)?params.value.toLowerCase():'';
        this.countryName = this.getCountryName(this.value);
      }
    }
  }


  // get country name from code
  // lanka
  // 2022.01.25
  getCountryName(code: string) {
    var countryObj = this.countryList.find((el) => {
      return el.code == code.toUpperCase();
    });
    return (countryObj)?countryObj.displayName:"";
  }
}
