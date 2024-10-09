import { ITMAlertCard } from './../models/alert-card.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert-customer-details',
  templateUrl: './alert-customer-details.component.html',
  styleUrls: ['./alert-customer-details.component.scss']
})
export class AlertCustomerDetailsComponent implements OnInit {

  @Input() alertCardData: ITMAlertCard;

  constructor() { }

  ngOnInit() {
  }

}
