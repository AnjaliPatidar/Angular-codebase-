import { Component, OnInit } from '@angular/core';
import { EntityCommonTabService } from '@app/modules/entity/services/entity-common-tab.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss']
})
export class AmenitiesComponent implements OnInit {

  amenitiesList: any = [];
  constructor(public entityCommonTabService: EntityCommonTabService) { }

  ngOnInit() {
    this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
      if (Object.keys(data).length > 0) {
        for (let companies of data.results) {
          if(companies.overview.comapnyInfo.amenities){
          this.amenitiesList = JSON.parse(companies.overview.comapnyInfo.amenities.value);
          }
        }
      }
    })
  }
}
