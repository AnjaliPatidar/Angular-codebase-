import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entity-name',
  templateUrl: './entity-name.component.html',
  styleUrls: ['./entity-name.component.sass']
})
export class EntityNameComponent implements OnInit {
  public currentRow :any;
  public alertId : any;
  public entityName: any;
  constructor() { }

  ngOnInit() {
  }
  agInit(params: any, $event): void {
    if (params) {
      this.currentRow = params.data ? params.data : {};
      this.alertId = this.currentRow ? this.currentRow.alertId : "";
      this.entityName = this.currentRow ? this.currentRow.entityName:"";
    }
  }
  openCard(){
    // return true;
    // document.getElementById("EI-"+this.alertId).click();
  }

}
