import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert-entity-details',
  templateUrl: './alert-entity-details.component.html',
  styleUrls: ['./alert-entity-details.component.scss']
})
export class AlertEntityDetailsComponent implements OnInit {
  @Input() alertData;
  constructor() { }

  ngOnInit() {
  }

  //  Navigating to entity page on click
  navigateToEntity(entityUrl) {
    if (entityUrl) {
      window.open(entityUrl, '_blank', 'noopener');
    }
  }
}
