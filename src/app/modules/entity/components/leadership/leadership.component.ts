import { Component, OnInit } from '@angular/core';
import {EntityFunctionService} from '../../services/entity-functions.service';
import {EntityCommonTabService} from '../../services/entity-common-tab.service';
import {EntityConstants} from '../../constants/entity-company-constant';

@Component({
  selector: 'app-leadership',
  templateUrl: './leadership.component.html',
  styleUrls: ['./leadership.component.css']
})
export class LeadershipComponent implements OnInit {
  public entitySearchResult = {
    list: EntityConstants.basicSharedObject.list,
    is_data_not_found: EntityConstants.basicSharedObject.is_data_not_found,
  }; 
  queryParams :any;
  constructor(
    private entityFunctionService : EntityFunctionService,
    private entityCommonTabService :EntityCommonTabService
  ) {
      this.entityCommonTabService.officerObservable.subscribe((handledofficerData) => {
        this.entitySearchResult.list['company_boardmembers'] = handledofficerData && handledofficerData.company_boardmembers ?  handledofficerData.company_boardmembers:[];
        this.entitySearchResult.list['company_key_executives'] = handledofficerData && handledofficerData.company_key_executives ?  handledofficerData.company_boardmembers:[];
        this.entitySearchResult.list['mixed_company_key_executives'] = handledofficerData && handledofficerData.mixed_company_key_executives ?  handledofficerData.mixed_company_key_executives:[];
        if (handledofficerData && handledofficerData['mixed_company_key_executives'].length === 0) {
          this.entitySearchResult.is_data_not_found.is_keyExecutive = false;
        }
        if (handledofficerData  && handledofficerData['has_company_members'].length === 0) {
          this.entitySearchResult.is_data_not_found.is_company_member = false;
        }
      });
  }
  

  ngOnInit() {
    this.queryParams = this.entityFunctionService.getParams()
  }

}
