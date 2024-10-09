import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

@Component({
  selector: 'app-group-assignment',
  templateUrl: './group-assignment.component.html',
  styleUrls: ['./group-assignment.component.scss']
})
export class GroupAssignmentComponent implements OnInit {
  GroupList: any;
  GroupLabel: any;
  GroupLevel: any;
  AlertIds: any;
  Reason: any;
  showResults: boolean;
  totalAlerts: any;
  succeededCount: any;
  errorCount: any;
  displayedColumns: string[] = ['id', 'status', 'error'];
  csvHeaderColumns: string[] = ['Alert ID', 'Status', 'Error Message'];
  dataSource = [];
  requestSent: boolean;
  languageJson: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public incomingdata: any,
    public dialogRef: MatDialogRef<GroupAssignmentComponent>,
    public commonService: CommonServicesService,
    private alertService: AlertManagementService,
    private sharedService: SharedServicesService
  ) {
  }

  ngOnInit() {
    this.GroupList = this.incomingdata.groupList;
    this.commonService.behaveObserverForgetLanguageJson.subscribe((resp)=>{
      if(resp){
        this.languageJson = resp;
      }
  });
  }

  getSelectedItem(i) {
    this.GroupLevel = i.listItemId;
  }

  notSafeNumbers(element, index) {
    return (isNaN(element) || element.includes(".")  || !Number.isSafeInteger(parseInt(element)));
  }

  assignAleartsToGroup() {
    let alertsArray = this.AlertIds.split(/\r?\n/).filter(item => item);
    if (alertsArray.some(this.notSafeNumbers)) {
      this.sharedService.showFlashMessage(this.languageJson['InvalidAlertIds'], 'danger');
      return;
    }
    let params = {
      "alertIds": alertsArray,
      "groupLevel": this.GroupLevel,
      "reason": this.Reason
    };
    this.requestSent = true;
    this.alertService.assignAlertsToGroup(params).subscribe((response) => {
      this.showResults = true;
      this.totalAlerts = alertsArray.length;
      if (response && response.succeededAlertIds && response.failedAlertIds) {
        this.succeededCount = response.succeededAlertIds.length;
        this.errorCount = response.failedAlertIds.length;
        for (let alert of response.succeededAlertIds) {
          this.dataSource.push({ "id": alert, "status": this.languageJson['Success'], "error": "" });
        }
        for (let alert of response.failedAlertIds) {
          this.dataSource.push({ "id": alert, "status": this.languageJson['AlertUpdateFailedStatus'], "error": this.languageJson['AlertIdNotFound'] });
        }
      }
    })
  }

  downloadReport() {
    const rows = [
      [this.languageJson['AlertID'], this.languageJson['Status'], this.languageJson['ErrorMessage']]
    ];
    for (let alert of this.dataSource) {
      let row = [alert.id, alert.status, alert.error];
      rows.push(row);
    }
    let csvContent = "data:text/csv;charset=utf-8,"
      + rows.map(e => e.join(",")).join("\n");

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", this.languageJson['AssignAlertstoGroup'] + ".csv");
    document.body.appendChild(link);
    link.click();
  }

  public trackByLabel(_, item): string {
    return item.label;
  }
}
