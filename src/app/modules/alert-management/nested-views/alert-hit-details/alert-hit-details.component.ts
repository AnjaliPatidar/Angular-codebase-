import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
@Component({
  selector: 'app-alert-hit-details',
  templateUrl: './alert-hit-details.component.html',
  styleUrls: ['./alert-hit-details.component.scss']
})
export class AlertHitDetailsComponent implements OnInit {

  selectedWatchListIndex = 0
  allComplete: boolean = false;
  radioArray: any = []
  hitCount: any
  generatedHits: any;
  selectedHitRecordId: any;
  selectedHit: string = '';
  @Output() userSelectedData = new EventEmitter();
  isHitFrozen: boolean
  indexCategory: string
  findIndex: number = -1
  @Input() set alertData(data) {
    if (data && data.alert_extra_data && data.alert_extra_data.selectedHitRecordId) {
      this.selectedHitRecordId = data.alert_extra_data.selectedHitRecordId
    }

    this.alertListGenerator(data)
    this.generatedHits = JSON.parse(JSON.stringify(data))
    this.selectedRadioEvent(data)
  }

  constructor() {
  }

  ngOnInit() {
  }

  selectedRadioEvent(data) {
    for (let i = 0; i < data.hits.length; i++) {
      if (this.selectedHitRecordId) {
        if (data.hits[i].hit_producer_category === "screening" || data.hits[i].hit_producer_category === "WatchlistScreeningAlert") {
          this.setHitCategoryIndex(data, i)
          if (this.findIndex != -1) {
            break;
          }
        } else if (data.hits[i].hit_producer_category === "BST_ADVERSE_MEDIA") {
          this.setHitCategoryIndex(data, i)
          if (this.findIndex != -1) {
            break;
          }
        }
      } else {
        if (this.findIndex == -1) {
          this.setDefaultIndex(data)
        }
      }
    }

    // For invalid selectedHitRecordId 
    if (this.selectedHitRecordId && this.findIndex == -1) {
      this.setDefaultIndex(data)
    }
  }

  setDefaultIndex(item: any) {
    let isChecked = true
    for (const hit of item.hits) {
      if (hit.hit_generated && hit.hit_generated.length > 0) {
        isChecked = false
        this.selectedHit = hit.hit_producer_category + 0;
        this.indexCategory = hit.hit_producer_category;
        this.onRadioChange(hit.hit_generated[0]);
        break;
      }
    }

    if (isChecked) {
      this.onRadioChange({});
    }
  }

  setHitCategoryIndex(item, i) {
    this.findIndex = item.hits[i].hit_generated.findIndex(hitValue => hitValue.hit_id == this.selectedHitRecordId)
    this.indexCategory = item.hits[i].hit_producer_category

    if (this.findIndex != -1) {
      this.selectedHit = this.indexCategory + this.findIndex
      this.onRadioChange(item.hits[i].hit_generated[this.findIndex])
    }
  }

  receiveHitsFilterValue($event) {
    let filterObj = this.generatedHits.hits.map(e => e.hit_generated.filter(item => item.confidence * 100 >= $event.confidenceFilter))
    filterObj.map((e, i) => this.radioArray[i].hit_generated = e)

    let updatedObj = JSON.parse(JSON.stringify(this.generatedHits))
    updatedObj.hits = this.radioArray
    this.selectedRadioEvent(updatedObj)
  }

  alertListGenerator(data) {
    if (!data || !data.hits) {
      return;
    }
    this.radioArray = data.hits
  }

  onRadioChange(data) {
    let userSelectedDataObj = data
    this.userSelectedData.emit(userSelectedDataObj)
  }
}
