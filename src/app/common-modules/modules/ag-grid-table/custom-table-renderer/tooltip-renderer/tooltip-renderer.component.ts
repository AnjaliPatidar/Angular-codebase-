import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-tooltip-renderer',
  templateUrl: './tooltip-renderer.component.html',
  styleUrls: ['./tooltip-renderer.component.scss']
})
export class TooltipRendererComponent implements OnInit {

  highlight: string;

  ngOnInit() {
  }

  agInit(params: any): void {
    if (params && params.data) {
      this.highlight = (params.data.highlight) ? params.data.highlight : '';
    }
  }
}
