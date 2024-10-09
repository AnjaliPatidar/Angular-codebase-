import { Component, OnInit } from '@angular/core';
import {EntityFunctionService} from '../../services/entity-functions.service';

@Component({
  selector: 'app-form-analysis',
  templateUrl: './form-analysis.component.html',
  styleUrls: ['./form-analysis.component.css']
})
export class FormAnalysisComponent implements OnInit {

  constructor(
    private entityFunctionService : EntityFunctionService
  ) { }

  queryParams :any;
  ngOnInit() {
    this.queryParams = this.entityFunctionService.getParams()
  }

}
