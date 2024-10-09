import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider-filter',
  templateUrl: './slider-filter.component.html',
  styleUrls: ['./slider-filter.component.scss']
})
export class SliderFilterComponent implements OnInit {
  public someRange:any;
  public someRange2config: any = {
    connect: true,
    start: [0, 100],
    tooltips: [true, true],
    range: {
      min: 0,
      max: 100
    },
    behaviour: 'drag',
  };
  constructor() { }

  ngOnInit() {
  }
  /**agInit() will call for every row of column */
  agInit(params: any, event): void {

  }
  onChangeSlider(e){
    
  }
}
