import { Component, OnInit } from '@angular/core';
import { AlertManagementService } from '../../alert-management.service';
import { AlertWatchlistInfoUtility } from './alert-watchlist-info.utility';

@Component({
  selector: 'app-alert-watchlist-info',
  templateUrl: './alert-watchlist-info.component.html',
  styleUrls: ['./alert-watchlist-info.component.scss']
})
export class AlertWatchlistInfoComponent implements OnInit {

  public watchlistData: object = {};

  constructor(private _alertService: AlertManagementService) { }

  ngOnInit() {
    this.getWatchlistAttributes()
  }

  getWatchlistAttributes() {
    this._alertService.getWatchlistData().subscribe((data) => {
      if (data != undefined 
          && data.hit_attributes != undefined 
          && data.hit_attributes.extra_data
          ) {
        this.watchlistData = AlertWatchlistInfoUtility.flattenWatchlistInformation(data.hit_attributes.extra_data);
      }
    });
  }

}
