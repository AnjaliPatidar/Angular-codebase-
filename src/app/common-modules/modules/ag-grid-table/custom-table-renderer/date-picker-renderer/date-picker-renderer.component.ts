import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'
import { CaseManagementService } from '@app/modules/case-management/case-management.service';
const datePipe = new DatePipe('en-US');

@Component({
  selector: 'app-date-picker-renderer',
  templateUrl: './date-picker-renderer.component.html',
  styleUrls: ['./date-picker-renderer.component.scss']
})
export class DatePickerRendererComponent implements OnInit {
  // Declaring custom variables 
  public selectedDate :any;
  public gridApi:any;
  public storeParams:any;
  //today's date
  todayDate:Date = new Date();
 
  constructor(private _caseService : CaseManagementService) { }

  ngOnInit() {
    // Setting min date to next day of today (tomorrow)
    this.todayDate.setDate(this.todayDate.getDate() + 1);
  }

  /**agInit() will call for every row of column */
  agInit(params: any, event): void {
    this.gridApi = params.api ? params.api : {};
    this.storeParams = params;
      if (params && params.api && params.api.gridOptionsWrapper && params.api.gridOptionsWrapper.gridOptions) {
        this.selectedDate = params.value ? params.value : '';
        
      }
  }

  /**Getting selected date and changing format 
   * Author : ganapathi
   * Date : 01-May-2020
  */
  onDateSelected(value){
    this.selectedDate = datePipe.transform(value, 'MMM d, y');
    
  var paramsData:any = {};
    if (this.gridApi && this.storeParams) {
      var rowNode = this.gridApi.getDisplayedRowAtIndex(this.storeParams.rowIndex);
    }
    if(this.selectedDate && rowNode && rowNode.data){
      paramsData.caseId =rowNode.data && rowNode.data.caseId?rowNode.data.caseId:"";
      paramsData.remediationDate =this.selectedDate;
      this._caseService.updateCaseAPI(paramsData).subscribe((resp)=>{
        rowNode.data['NextRemediationDate'] = this.selectedDate;
      })
    }
  }  

}
