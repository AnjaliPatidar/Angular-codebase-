import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'app-entity-source-modal',
  templateUrl: './entity-source-modal.component.html',
  styleUrls: ['./entity-source-modal.component.scss']
})
export class EntitySourceModalComponent implements OnInit {

  @Input('data') data?: any;
  @ViewChild('trigger' , { static: false }) trigger: MatMenuTrigger;
  sourceData:any
  isSourceLoad:boolean

  ngOnInit() {
    this.setPopupPosition();
  }

  // @purpose: set the popup opening position
  // @date: 12/08/2021
  // @author: ammshathwan
  private setPopupPosition(): void {
    if(this.data && this.data.source){
      this.sourceData = this.data.source
    }
  }

  // @purpose: close the opened poup through close icon
  // @date: 12/08/2021
  // @author: ammshathwan
  close(): void {
    this.trigger.closeMenu();
  }

}
