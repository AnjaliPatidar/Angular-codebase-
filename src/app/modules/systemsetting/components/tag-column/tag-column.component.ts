import { Component, ViewChild } from '@angular/core';
import { AgGridTableService } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.service';
import { TagGridData } from '../../models/tag-management/tag-grid-data.model';
import { Tag } from '../../models/tag-management/tag.model';
import { TagManagementApiService } from '../../services/tag-management.api.service';
import { CollorPickerComponent } from '../collor-picker/collor-picker.component';


@Component({
  selector: 'app-tag-column',
  templateUrl: './tag-column.component.html',
  styleUrls: ['./tag-column.component.scss']
})
export class TagColumnComponent {
  tag: Tag;
  tagNew: Tag;
  rowData: TagGridData;
  gridApi: any;
  isEditMode: boolean;
  colDef
  id: string;
  selectedColor: string = "#545454";
  isInputError: boolean;
  inputErrorMesage: string;
  tagAction:string

  @ViewChild(CollorPickerComponent, { static: false }) childComponent: CollorPickerComponent;
  @ViewChild('tagInput', { static: false }) tagInput;
  constructor(private agGridTableService: AgGridTableService, private tagManagementService: TagManagementApiService) {
    this.editCancelEventListner();
  }

  agInit(params: any): void {
    if (params) {
      if (params.node) {
        this.gridApi = params.node.gridApi;
        this.id = params.node.id;
        this.gridApi.suppressCellSelection = true;
      }
      if(params.colDef){
        this.colDef = params.colDef;
      }
      if (params.data) {
        this.rowData = params.data;
        if (params.column.colId) {
          this.tag = params.data[params.column.colId];
        }
      }
    }
    this.editInput()
  }

  openColorPicker(selectedColor) {
    this.childComponent.openMenu(selectedColor);
  }

  handleColorChange(colorCode) {
    this.tagNew.color_code = colorCode;
    this.selectedColor = colorCode;
  }

  private editCancelEventListner(): void {
    if (this.agGridTableService.getObserverForTagTagAddEdit) {
      this.agGridTableService.getObserverForTagTagAddEdit.subscribe(res => {
        if (res && res['action'] && res['id'] === this.id) {
          this.tagAction = res['action'];
          if (res['action'] === 'add') {
            this.isEditMode = true;
            this.tagNew = { content: '', color_code: '', entity_type: 'Document' };
          }
          else if (res['action'] === 'edit') {
            this.isEditMode = true;
            this.selectedColor = this.tag && this.tag.color_code;
            if (this.tag && this.tag.content && this.tag.entity_type) {
              this.tagNew = { id: this.tag.id, content: this.tag.content, color_code: this.tag && this.tag.color_code, entity_type: this.tag.entity_type };
            }
          }
          else if (res['action'] === 'cancel') {
            this.isEditMode = false;
            this.isInputError = false;
          }
          else if (res['action'] === 'save') {
            if (this.tagNew !== undefined) {
              this.validateTag();
              this.updateTagData();
            }
          }
        }
      });
    }
  }

  private updateTagData(): void {
    if (this.gridApi) {
      const node = this.gridApi.getRowNode(this.id);
      if (this.rowData.isValid) {
        this.isEditMode = false;
        this.tag = this.tagNew;
        this.rowData.tag = this.tag;
        if(node) {
          this.setRowHeight(56);
        }
      }
      else {
        this.setRowHeight(66);;
        this.isInputError = true;
      }
      this.gridApi.updateRowData({ update: [this.rowData] });
    }
  }

  private validateTag(): void {
    this.inputErrorMesage = '';
    this.rowData.isValid = true;
    this.isInputError = false;
    if (this.tagNew && !this.tagNew.content) {
      this.inputErrorMesage = 'Enter tag name';
      this.rowData.isValid = false;
      this.setRowHeight(66);
    }
    else if (this.gridApi && this.tagNew && this.tagNew.content) {
      this.gridApi.forEachNode((node) => {
        if (node.data && node.data.tag && node.data.tag.content)
          if (node.data.tag.id !== this.tagNew.id && node.data.tag.content.toLowerCase() === this.tagNew.content.toLocaleLowerCase()) {
            this.inputErrorMesage = 'Tag already exists';
            this.rowData.isValid = false;
          }
      });
    }
  }

  handleInputChange() {
    this.inputFocus();
    this.isInputError = (this.tagNew.content === '');
    const node = this.gridApi.getRowNode(this.id);
    if (!this.isInputError) {
      this.setRowHeight(56);
      this.inputErrorMesage = '';
    } else {
      this.getAllRows().then(res => {
        if(res[0] && res[0].data && res[0].data.isAdded && this.tagAction === 'add'){
          this.setRowHeight(66)
        }else if(this.tagAction === 'edit'){
          this.setRowHeight(66)
        }else{
          this.setRowHeight(56)
        }
      });
      this.inputErrorMesage = 'Enter tag name';
    }

    this.tagNew && this.tagNew.content ? this.tagManagementService.updatedTag = this.tagNew.content : ""
  }

  setRowHeight(height?:number):void{
      const node = this.gridApi.getRowNode(this.id);
      if(node){
        this.getAllRows().then(res => {
          if(res[0] && res[0].data && res[0].data.isAdded){
            this.setCurrentHeight(height , res[0])
          }else{
            this.setCurrentHeight(height , node)
          }
        });
      }
  }

  setCurrentHeight(height:number, element?:any):void{
    let currentHeight = this.tagManagementService.currentRowHeight;
    if(currentHeight > 56 && this.isInputError){
      element.setRowHeight(currentHeight)
    }else if(currentHeight > 56){
      element.setRowHeight(currentHeight)
    }else{
      element.setRowHeight(56)
    }
  }

  getAllRows() {
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node));
    return new Promise(function (resolve) {
      resolve(rowData);
    });
  }

   // @reason : set cursor movement for input
   // @author: ammshathwan
   // @date: 2/12/2021
   inputFocus(){
    var Element = document.getElementById('tag-input-id')
    var currentPosition: 0;
    var width = 10;

    if(Element){
      Element.addEventListener("keydown" , (e) => {
        const count = this.getCaretPosition(Element)
        if(count){
          currentPosition = count.start;
        }
        if(e && e.keyCode){
          if(currentPosition > 0 && e.keyCode == 37){
            currentPosition--
            this.setCaretPosition(Element, currentPosition , currentPosition)
            Element.scrollLeft = -Element.scrollWidth;
          }else if(currentPosition < this.tagNew.content.length  && e.keyCode == 39){
            currentPosition++
            this.setCaretPosition(Element, currentPosition , currentPosition)
            width = width + width;
            Element.scrollLeft = width;
          }else if(currentPosition > this.tagNew.content.length  && e.keyCode == 39){
            this.setCaretPosition(Element, this.tagNew.content.length - 1 , this.tagNew.content.length - 1)
          }else if(currentPosition === 0  && e.keyCode == 37){
            this.setCaretPosition(Element, 0 , 0)
          }
        }
        })
    }
}

// @reason : get the current postion of cursor
// @author: ammshathwan
// @date: 2/12/2021
getCaretPosition(ctrl) {
  if (ctrl && ctrl.selection) {
      ctrl.focus();
      var range = ctrl.selection.createRange();
      if(range.text.length && range.text & range.text.length){
        var rangelen = range.text.length;
        range.moveStart('character', -ctrl.value.length);
        var start = range.text.length - rangelen;
        return {
            'start': start,
            'end': start + rangelen
        };
      }
  }
  else if (ctrl && ctrl.selectionEnd && ctrl.selectionStart || ctrl.selectionStart == '0') {
      return {
          'start': ctrl.selectionStart,
          'end': ctrl.selectionEnd
      };
  } else {
      return {
          'start': 0,
          'end': 0
      };
  }
}

// @reason : set the current postion of cursor
// @author: ammshathwan
// @date: 2/12/2021
setCaretPosition(ctrl, start, end) {
  if(ctrl && start && end){

    if (ctrl.setSelectionRange) {
      ctrl.focus();
      ctrl.setSelectionRange(start, end);
  }
  else if (ctrl.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', start);
      range.select();
  }
  }
}


// @reason : stop keyboard events for next , previous and enter (add key code if needd)
// @author: ammshathwan
// @date: 2/12/2021
editInput(){
  this.colDef.suppressKeyboardEvent = params => {
    const keyCode = params.event.keyCode;
    params.editing = true;
    const gridShouldDoNothing = params.editing && (keyCode=== 39 || keyCode=== 37 || keyCode === 13);
    return gridShouldDoNothing;
  }
}
}
