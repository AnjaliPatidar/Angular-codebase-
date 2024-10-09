import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertManagementService } from '../../alert-management.service';
import { AlertCustomerInfoUtility } from './alert-customer-info.utility';

@Component({
  selector: "app-alert-customer-info",
  templateUrl: "./alert-customer-info.component.html",
  styleUrls: ["./alert-customer-info.component.scss"],
})
export class AlertCustomerInfoComponent implements OnInit {
  public shareholdersData: Array<any> = [];
  public officershipData: Array<any> = [];
  public selectedEntityValue: number = 1;
  public shareholderCount: number = 0;
  public officershipCount: number = 0;

  constructor(private _alertService: AlertManagementService, private changeDetector: ChangeDetectorRef,) {}

  ngOnInit() {
    this.getCustomerInformation();
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  getCustomerInformation() {
    this._alertService.getCustomerData().subscribe((data) => {
      if (data) {
        if(data.shareholders){
          this.shareholdersData = AlertCustomerInfoUtility.mapShareholders(data.shareholders)
          this.shareholderCount = this.shareholdersData.length;
        }
        if(data.officership){
          this.officershipData = AlertCustomerInfoUtility.mapOfficership(data.officership)
          this.officershipCount = this.officershipData.length;
        }
      }
    });
  }

}
