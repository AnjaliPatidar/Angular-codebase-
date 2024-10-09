import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confidence-level',
  templateUrl: './confidence-level.component.html',
  styleUrls: ['./confidence-level.component.sass']
})
export class ConfidenceLevelComponent implements OnInit {
  currentRow: any;
  alertId: any;
  public confidanceLev: any;
  metaData: any;
  watchlistData: any;
  constructor() { }

  ngOnInit() {
  }

  /**agInit() will call for every row of column */
  agInit(params: any, $event): void {
    if (params) {
      this.currentRow = params.data ? params.data : {};
      this.alertId = this.currentRow ? this.currentRow.alertId : "";
      this.metaData = this.currentRow.completeRowData;
      /**Get confidence level data 
      * Author : karnakar
      * Date : 27-Aug-2019
      */
      if (this.currentRow) {
        let data;
        if (this.currentRow.completeRowData) {
          let dataString = this.currentRow.completeRowData.alertMetaData ? this.currentRow.completeRowData.alertMetaData : {};
          data = JSON.parse(dataString);
          if (data.results) {
            let screenList = data.results.screening ? data.results.screening : {};
            if (screenList.watchlists) {
              let watchlist = screenList.watchlists ? screenList.watchlists : {};
              this.getMaxConfidence(watchlist);
            } else {
              this.confidanceLev = "";
            }
          } else {
            this.confidanceLev = "";
          }
        } else {
          this.confidanceLev = "";
        }
      }
    }
  }

  // sorting the watchlist based on id and confidence level
  getMaxConfidence(watchlist) {
    this.watchlistData = watchlist;
    this.watchlistData = this.watchlistData.sort(function (a, b) { return b.basic_info.id - a.basic_info.id });
    let watchlistData = [];
    let ids = [];
    this.watchlistData.map((wl) => {
      if (ids.indexOf(wl.basic_info.id) == -1) {
        watchlistData.push(wl);
        ids.push(wl.basic_info.id);
      }
    })
    watchlistData = watchlistData.sort(function (a, b) { return a.basic_info.id - b.basic_info.id });
    this.watchlistData = watchlistData;
    this.watchlistData = this.watchlistData.sort(function (a, b) { return b.confidence - a.confidence });
    if (this.watchlistData) {
      this.confidanceLev = this.watchlistData[0].confidence ? this.watchlistData[0].confidence : " ";
    } else {
      this.confidanceLev = "";
    }
  }

  // changing confidance level to percentage
  getConfidencePercentage(num) {
    if (num && num <= 1) {
      num = parseFloat(num) * 100
      return num.toFixed(2);
    }
    return num;
  }
}
