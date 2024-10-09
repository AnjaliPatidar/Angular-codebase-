import { Component, Input, OnInit } from '@angular/core';
import { SharedServicesService } from '@app/shared-services/shared-services.service';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {
  notificationType: string = '';

  constructor(private _sharedService: SharedServicesService) {}

  ngOnInit() {
    this._sharedService.isDisplayNotificationBar$.subscribe(value => {
        this.notificationType = value.ntfType;
    });
  }

  onCloseNotificationbar() {
    this._sharedService.displayNotificationBar(false, '', '', false, '');
  }
}
