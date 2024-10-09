import { Component } from '@angular/core';
import { DropDownData } from '@app/shared/model/drop-down-data.model';
import { GridCellDropDown } from '@app/shared/model/grid-cell-drop-down.model';

@Component({
  selector: 'app-drop-down-column',
  templateUrl: './drop-down-column.component.html',
  styleUrls: ['./drop-down-column.component.scss']
})

export class DropDownColumnComponent {

  value: any;
  gridCellDropDown: GridCellDropDown = new GridCellDropDown();
  selectedItem: DropDownData = new DropDownData();

  agInit(params: any): void {
    if (params) {
      if (params.data) {
        this.value = params.data[params.column.colId];
        this.gridCellDropDown = params.colDef.dropDownData;
        this.selectedItem = this.gridCellDropDown.dropDownList.find(item => item.value === this.value);
      }
    }
  }

  valueChanged(): void {

  }

  getBgColor(color: string) {
    return this.hexToRGB(color, 0.2);
  }

  hexToRGB(hex: string, alpha: number) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  public trackByValue(_, item): string {
    return item.value;
  }
}
