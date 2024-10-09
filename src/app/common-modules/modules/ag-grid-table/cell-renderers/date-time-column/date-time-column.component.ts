import { Component } from "@angular/core";

@Component({
  selector: "app-date-time-column",
  templateUrl: "./date-time-column.component.html",
  styleUrls: ["./date-time-column.component.scss"],
})
export class DateTimeColumnComponent {
  dateTimeValue: Date;
  notifiction: string = "";

  agInit(params: any, event): void {
    if (params && params.data && params.column.colId) {
      this.dateTimeValue = params.data[params.column.colId] ? params.data[params.column.colId] : '';
      this.notifiction = params.data["notification"] ? params.data["notification"] : '';
    }
  }
}
