import { Component, OnInit } from '@angular/core';
import {EntityFunctionService} from '../../services/entity-functions.service';

@Component({
  selector: 'app-threats-intelligence',
  templateUrl: './threats-intelligence.component.html',
  styleUrls: ['./threats-intelligence.component.css']
})
export class ThreatsIntelligenceComponent implements OnInit {

  constructor(
    private entityFunctionService : EntityFunctionService
  ) { }
  
  queryParams :any;
  ngOnInit() {
    this.queryParams = this.entityFunctionService.getParams()
  }

}
