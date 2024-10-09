import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { EntityApiService } from '@app/modules/entity/services/entity-api.service';
import { EntityCommonTabService } from '@app/modules/entity/services/entity-common-tab.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  managerDetails: any;
  officership: any;
  showManager = false;
  constructor(
    public entityApiService: EntityApiService,
    public entityCommonTabService: EntityCommonTabService
  ) { }

  ngOnInit() {
    this.entityCommonTabService.sourceTargetDetails.subscribe((data: any) => {
      if (Object.keys(data).length > 0) {
        for (let companies of data.results) {
          this.officership = companies.links.officership;
        }
        if (this.officership !== undefined) {
          this.getManagerDetails(this.officership);
        }
      }
    }, err => {
    })
  }

  ngOnDestroy() {
  }

  // methos to get manager details
  getManagerDetails(officership) {
    this.entityApiService.getManagerData(officership).subscribe((data: any) => {
      for (let manager of data.results) {
        if (manager.officership) {
          this.managerDetails = manager.officership[0];
        }
      }
    })
  }

  formatName(name) {
    if (name) {
      let data = name.split(" ");
      if (data.length >= 0) {
        let firstName = data[0].charAt(0).toUpperCase()
        let lastName = data[data.length - 1].charAt(0).toUpperCase()
        if (data.length == 1) {
          return firstName;
        } else {
          return firstName + lastName;
        }
      }
    }
  }

}
