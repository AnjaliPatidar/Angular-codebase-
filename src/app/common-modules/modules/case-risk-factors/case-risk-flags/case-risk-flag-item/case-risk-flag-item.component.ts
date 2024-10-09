import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-case-risk-flag-item',
  templateUrl: './case-risk-flag-item.component.html',
  styleUrls: ['./case-risk-flag-item.component.scss']
})
export class CaseRiskFlagItemComponent implements OnInit {

  @Input() riskFlag: string = "";

  @Input() color: string = "";

  @Input() flagName: string = "";

  constructor() { }

  ngOnInit() {
  }

}
