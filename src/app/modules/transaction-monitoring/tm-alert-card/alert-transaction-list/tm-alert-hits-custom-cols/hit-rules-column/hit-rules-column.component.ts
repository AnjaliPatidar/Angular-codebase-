import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ITMHitRule } from '../../../models/alert-hit-rule.model';
import { ITMAlertHit } from '../../../models/alert-hit.model';

@Component({
  selector: 'app-hit-rules-column',
  templateUrl: './hit-rules-column.component.html',
  styleUrls: ['./hit-rules-column.component.scss']
})
export class HitRulesColumnComponent implements OnInit, Partial<ICellRendererAngularComp> {

  rowData: ITMAlertHit;
  hitRules: ITMHitRule[];

  constructor() {
  }

  ngOnInit() {
  }

  public agInit(params): void {

    if (params.data) {
      const colId = params.data[params.column['colId']];
      this.rowData = params.data;

      if (params.data) {
        this.setHitRules(params.data);
      }
    }
  }

  setHitRules(rowData: ITMAlertHit) {
    const rulesJsonString = rowData.rule || '';
    try {
      let rules = JSON.parse(rulesJsonString);

      if (rules && typeof rules === 'object' && rules.name) {
        rules = [rules];
      }

      this.hitRules = rules;

    } catch {
      //json parse error
      this.hitRules = [];
    }
  }

}
