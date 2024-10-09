import { Component, OnInit } from '@angular/core';
import {EntityFunctionService} from '../../services/entity-functions.service';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {

  constructor(
    private entityFunctionService : EntityFunctionService
  ) { }
  
  queryParams :any;
  ngOnInit() {
    this.queryParams = this.entityFunctionService.getParams()
  }

}
