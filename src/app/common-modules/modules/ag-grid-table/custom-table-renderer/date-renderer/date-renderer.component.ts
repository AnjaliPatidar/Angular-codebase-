import {Component, OnInit, ElementRef, Renderer2, Input, Output, EventEmitter, AfterViewInit, HostListener } from '@angular/core';
import * as moment from 'moment';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';

declare var $: any;

@Component({
  selector: 'app-date-renderer',
  templateUrl: './date-renderer.component.html',
  styleUrls: ['./date-renderer.component.scss']
})
export class DateRendererComponent implements OnInit,AfterViewInit {

  public gridApi:any;
  public colId;
  public selected:any = 'Last 30 Days';
  public gridOptions:any;
  public rowData:any;
  public rowModelType:any;
  /**agInit() will call for every row of column */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).classList.contains('date-picker')) {
      document.querySelectorAll('.ag-header').forEach(header => header.classList.remove('ag-header-hover'));
    }
  }
  agInit(params: any, event): void {
    this.gridOptions = params.api.gridOptionsWrapper.gridOptions;
    this.rowData = this.gridOptions && this.gridOptions.rowData && this.gridOptions.rowData.length ? this.gridOptions.rowData : [];
    this.gridApi = params.api ? params.api : '';
    this.colId = params.colId ? params.colId : '';
    this.rowModelType = params.api.gridOptionsWrapper.gridOptions.rowModelType ? params.api.gridOptionsWrapper.gridOptions.rowModelType : '';
  }
  @Input ('inputdataFromSourceMonotoring') public inputdataFromSourceMonotoring :any;
  @Output() outputDataFromSourceMonotoring = new EventEmitter();
  alwaysShowCalendars: boolean;
  keepCalendarOpeningWithRange : boolean;
  showRangeLabelOnInput:boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Last 30 Days': [moment().subtract(29, 'days').format(), moment().format()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];

  isInvalidDate = (m: moment.Moment) =>  {
    return this.invalidDates.some(d => d.isSame(m, 'day') )
  }
  constructor(private ele:ElementRef,private renderer: Renderer2,
    private _commonService: CommonServicesService) { }

  ngOnInit() {
    setTimeout(()=>{
    this.selected  = { "startDate":this.ranges['Last 30 Days'][0], "endDate": this.ranges['Last 30 Days'][1] }
    },1000);
  }

  ngAfterViewInit(){
    this._commonService.getDataFromComponentBehaveObserver.subscribe((resp)=>{
      if(resp && resp.rowData && resp.rowData.length && this.gridOptions){
        this.gridOptions.rowData = resp.rowData;
        this.rowData = this.gridOptions.rowData;
      }
    })
  };

  addDateClassToTableHeader(e){
    if(this.inputdataFromSourceMonotoring =='sourceMonitoring'){
      var element = this.ele.nativeElement.closest('.date-filter-container');

    }
    else{
      var element = this.ele.nativeElement.closest('.ag-header');
      if(!this.ele.nativeElement.closest('.ag-header-hover')){
        this.renderer.addClass(element, 'ag-header-hover');
      }
    }
  }

  /**Getting checked values for row data
   * Author : karnakar
   * Date:29-Dec-2019
  */
  clickedValue(eve){
    this.outputDataFromSourceMonotoring.emit(eve);
  }
}

// $(document).on("click", function(e) {
//   if (!$(e.target).is("input.date-picker")) {
//     $(".ag-header").removeClass("ag-header-hover");
//   }
// });

// $(document).ready(function(){
//   if($(".md-drppicker .buttons_input button")[1]){
//     $(".md-drppicker .buttons_input button")[1].click(function(){
//
//     })
//   }
// })
