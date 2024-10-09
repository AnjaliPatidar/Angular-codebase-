import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { AlertHitDetailsComponent } from '../alert-hit-details.component';

@Component({
  selector: 'app-alert-hits-filter-modal',
  templateUrl: './alert-hits-filter-modal.component.html',
  styleUrls: ['./alert-hits-filter-modal.component.scss']
})
export class AlertHitsFilterModalComponent implements OnInit {
  public confidenceFilter: number = 0;
  @Output() hitsEvent = new EventEmitter<object>();
  @Input() menuTrigger: MatMenuTrigger;
  constructor() {
  }

  ngOnInit() {
  }
  sendHitsFilterValue() {
    let data = {
      confidenceFilter: this.confidenceFilter
    }
    this.hitsEvent.emit(data)
    this.menuTrigger.closeMenu()
  }
}