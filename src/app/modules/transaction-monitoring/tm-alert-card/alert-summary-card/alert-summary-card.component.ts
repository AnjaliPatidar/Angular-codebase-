import { ITMAlertCard } from './../models/alert-card.model';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertManagementService } from '@app/modules/alert-management/alert-management.service';
import { find } from 'lodash-es';

@Component({
  selector: 'app-alert-summary-card',
  templateUrl: './alert-summary-card.component.html',
  styleUrls: ['./alert-summary-card.component.scss']
})
export class AlertSummaryCardComponent implements OnInit, OnChanges {

  @Input() alertCardData: ITMAlertCard;

  alertStatusList: any[] = [
    {
      text: 'Open',
      status: 'open',
      icon: 'info',
      colorCode: 'ff822b'
    }
  ];
  userList: any[] = [];
  selectedStatus: any = {};
  currentUser: any = {};

  statusFormCtrl: FormControl = new FormControl();
  assigneeFormCtrl: FormControl = new FormControl();

  constructor(private _alertService: AlertManagementService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.alertCardData.currentValue) {
      this.setCurrentStatus(this.alertCardData.alertStatus);
      this.assigneeFormCtrl.setValue(this.alertCardData.assignee);
    }
  }

  ngOnInit() {
    // this.getAlertStatusList();
  }

  getAlertStatusList() {
    this._alertService.getStatus().subscribe((response) => {
      this.alertStatusList = response;
      this.selectedStatus = response[1];
    });
  }

  setCurrentStatus(status) {
    const statusObj = find(this.alertStatusList, status)
    this.statusFormCtrl.setValue(statusObj || this.alertStatusList[0]);
  }

  getBgColor(color) {
    let selectedColor = '#' + color;
    return this.hexToRGB(selectedColor, 0.2);
  }

  getColor(color) {
    return '#' + color
  }

  // TODO: duplicate, move to helper utils
  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  public trackByText(_, item): string {
    return item.text;
  }

}
