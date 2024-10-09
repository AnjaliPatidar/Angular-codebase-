import { Component, ElementRef, ViewChild, ViewChildren ,QueryList, AfterViewInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GeneralSettingsApiService } from '../../services/generalsettings.api.service';
import { AgGridTableService } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.service';
import { Tag } from '../../models/tag-management/tag.model';
import { CollorPickerComponent } from '../collor-picker/collor-picker.component';
import { TagManagementApiService } from '../../services/tag-management.api.service';
import { TagGridData } from '../../models/tag-management/tag-grid-data.model';
import { TagEdit } from '../../models/tag-management/tag-edit.model';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { ConfirmaionmodalComponent } from '../../modals/confirmaionmodal/confirmaionmodal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

@Component({
  selector: 'app-sub-tags-column',
  templateUrl: './sub-tags-column.component.html',
  styleUrls: ['./sub-tags-column.component.scss']
})

export class SubTagsColumnComponent implements AfterViewInit{

  id: string;
  colId: string;
  rowData: any;
  gridApi: any;
  rowDataOld: TagGridData;


  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagFormControl = new FormControl();
  filteredTags: Observable<Tag[]>;

  isEditMode: boolean;
  selectedTag
  isInputEmpty: boolean = true;
  tagList
  newTags: Tag[] = [];
  hiddenTag: Tag[] = []
  chipsTotalWidth: number;
  hiddenState: boolean
  currentId: number
  selectedSubTag
  selectedHiddenTag
  selectedColor: string = "#00796b"
  isTagAvilable:boolean;
  subTag
  filteredTagList = []
  defaultColorCode = "#42b7ff"
  errorText:string
  isError:boolean
  tagAction:string
  tagValue:string

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('tagWrapper', { static: true }) tagWrapper;
  @ViewChildren('tagElem', { read: ElementRef }) tagElem: QueryList<ElementRef>;
  @ViewChild(CollorPickerComponent, { static: false }) childComponent: CollorPickerComponent;


  constructor(
    private generalSettings: GeneralSettingsApiService,
    private agGridTableService: AgGridTableService,
    private tagService: TagManagementApiService,
    public sharedService: SharedServicesService,
    public modalservice: NgbModal,
  ) {
    this.editCancelEventListner();
  }

  agInit(params: any): void {
    if (params) {
      this.colId = params.column.colId;
      if (params.node) {
        this.gridApi = params.node.gridApi;
        this.id = params.node.id;
      }
      if (params.data) {
        this.rowData = params.data;
        this.rowDataOld = JSON.parse(JSON.stringify(this.rowData));
        this.subTag = params.data[this.colId];
        this.selectedTag = this.subTag
      }
    }
    this.getSubTags();
  }

  ngAfterViewInit():void {
    this.handleOverlapingTags();
  }

  openColorPicker(tag:Tag):void{
    if (this.isEditMode) {
      const subArrayIndex = this.newTags.findIndex((obj => obj.id == tag.id));
      const hiddenArrayIndex = this.hiddenTag.findIndex((obj => obj.id == tag.id))
      this.selectedHiddenTag = this.hiddenTag[hiddenArrayIndex]
      this.selectedSubTag = this.newTags[subArrayIndex];
      if (this.selectedSubTag.color_code) {
        this.selectedColor = this.selectedSubTag.color_code;
      }
      this.childComponent.openMenu(this.selectedColor);
    }
  }

  handleColorChange(colorCode: string): void {
    if (this.selectedHiddenTag && this.selectedHiddenTag.color_code) {
      this.selectedHiddenTag.color_code = colorCode;
    }
    if (this.selectedSubTag.color_code) {
      this.selectedSubTag.color_code = colorCode;
    }
  }

  createNewTag(tag:string):void{
    this.tagValue = ""
    if(tag){
      if(this.tagService.updatedTag === tag || this.rowData.tag.content === tag){
        this.errorText = "Tag and Subtag can't be same";
        this.isError = true;
      }
      else if(this.tagService.updatedTag !== tag){
        let newTag = {
          content: tag,
          color_code: this.defaultColorCode,
          entity_type: this.agGridTableService.tagEntity,
          sub_tags: []
        }
        this.tagService.createTags([newTag]).then(
          tags => {
            tags.forEach(tag => {
              if(tag) {
                this.newTags.push(tag)
              }
            });
          }
        )
      }
    }
  }

  editCancelEventListner(): void {
    if (this.agGridTableService.getObserverForTagTagAddEdit) {
      this.agGridTableService.getObserverForTagTagAddEdit.subscribe(res => {
        if (res && res['action'] && res['id'] === this.id) {
          this.tagAction = res['action'];
          if (res['action'] === 'add') {
            this.isEditMode = true;
            this.newTags = [];
            this.selectedTag = [];
            this.isInputEmpty = true;
            this.filterTags();
          }
          else if (res['action'] === 'edit') {
            this.isEditMode = true;
            this.newTags = this.selectedTag;
            this.hiddenTag = [];
            this.isInputEmpty = true;
            this.filterTags();
            this.setRowHeight();
          }
          else if (res['action'] === 'cancel') {
            this.isEditMode = false;
            this.hiddenTag = [];
            this.setRowHeight(56)
            this.handleOverlapingTags();
          }
          else if (res['action'] === 'save') {
            if(this.tagService.updatedTag !== ""){
              this.selectedTag = this.newTags;
              this.isEditMode = false;
              this.hiddenTag = [];
              this.updateTagData();
              this.errorText = "";
              this.isError = false;
              this.handleOverlapingTags();
            }else{
              this.setRowHeight(66);
            }
          }
        }
      });
    }
  }

  removeTag(tag: Tag): void {
    this.tagValue = ""
    this.isInputEmpty = true;
    const subArrayIndex = this.newTags.indexOf(tag);
    const hidenArrayIndex = this.hiddenTag.indexOf(tag);
    if (subArrayIndex >= 0) {
      this.newTags.splice(subArrayIndex, 1);
      this.selectedTag = this.newTags;
      this.hiddenTag = [];
    }
    if (hidenArrayIndex >= 0) {
      this.hiddenTag.splice(hidenArrayIndex, 1);
    }
    this.filterTags();
    this.setRowHeight();
  }

  selected(event): void {
    this.isInputEmpty = true;
    if (event && event.option && event.option.value) {
      event.option.value.entity_count = 0;
      this.newTags.push(event.option.value);
      this.currentId = event.option.value.id;
    }
    this.selectedTag = this.newTags;
    this.tagInput.nativeElement.value = '';
    this.filterTags();
    this.setRowHeight();
    this.tagInput.nativeElement.blur();
  }

  getSubTags(): void {
    this.generalSettings.behaviorSubjectForGetTagList.subscribe((res) => {
      this.tagList = res.map(t => t.tag);
      this.getFilteredTag()
    });
  }

  getFilteredTag(){
    this.filteredTags = this.tagFormControl.valueChanges.pipe(
      startWith(null || ''),
      map((value) => this._filter(value))
    );
  }

  onFocus():void{
    this.tagFormControl.setValue(null);
  }

  displayFn(tag:Tag): string {
    if (tag) {
      return tag && tag.content ? tag.content : '';
    }
  }

  private _filter(content: string): Tag[]{

    let filteredTags = [];
    if (content) {
      const filteredContent = content.toString().toLocaleLowerCase();
      filteredTags = this.filteredTagList.filter((tag) =>
        (tag && tag.content).toString().toLowerCase().includes(filteredContent)
      )
      this.validateTagInput(content);
      return filteredTags

    }else{
      this.isTagAvilable = false;
      filteredTags = this.filteredTagList.filter((tag) =>
        (tag && tag.content).toString().toLowerCase().includes('')
      )
      return filteredTags
    }
  }

  handleOverlapingTags(): void {
    this.chipsTotalWidth = 0;
    if (this.tagElem) {
      let parentWidth = 0;
      setTimeout(() => {
        if(this.tagWrapper.nativeElement && this.tagWrapper.nativeElement.offsetWidth) parentWidth = this.tagWrapper.nativeElement.offsetWidth - 45;
        this.tagElem.toArray().forEach((child, index) => {
          if(child.nativeElement.scrollWidth) this.chipsTotalWidth += child.nativeElement.scrollWidth
          if (this.tagWrapper && this.tagWrapper.nativeElement && parentWidth < this.chipsTotalWidth) {
            this.chipsTotalWidth -= child.nativeElement.scrollWidth;
            child.nativeElement.classList.add('d-none')
            if (this.selectedTag.length && this.selectedTag[index]) {
              this.hiddenTag.push(this.selectedTag[index])
            } else {
              this.hiddenTag.push(this.selectedTag)
            }
          }
        })
      } , 100)
    }
    else if(this.isEditMode){
      this.setRowHeight()
    }
  }

  private updateTagData(): void {
    if (this.gridApi) {
      this.rowData[this.colId] = this.newTags;
      this.gridApi.updateRowData({ update: [this.rowData] });
    }
    this.setRowHeight(56)
  }

  hidePlcaeHolder(): void {
    if (this.isEditMode) {
      this.tagFormControl.valueChanges.subscribe(() => {
        this.isInputEmpty = (this.tagFormControl.value == "" && this.newTags.length == 0 ? true : false)
        if(this.tagFormControl.value == ""){
          this.isTagAvilable = false;
        }
      })
    }
  }

  filterTags():void{
    this.filteredTagList = this.tagList;
    this.newTags.forEach(tag => {
      this.filteredTagList = this.filteredTagList.filter(alltag =>
        (this.newTags.length || alltag.content && tag.content && this.rowData && this.rowData.tag && this.rowData.tag.content) ?
        alltag.content !== tag.content && this.rowData.tag.content !== alltag.content  : null
      )
    })
  }

  validateTagInput(value :string): void{
    this.isTagAvilable = true;
    let result =  this.newTags.filter(alltag =>
      (value && alltag.content) ?
      alltag.content === value : null
    )
    if(result && result.length > 0){
      this.isError = true;
      this.errorText = "Tag already exists"
      this.isTagAvilable = false
    }else{
      this.isError = false;
      this.errorText = ""
    }
  }

  setRowHeight(height?:number):void{
    setTimeout(() => {
      let currentRowHeight = this.tagWrapper.nativeElement.offsetHeight;
      const node = this.gridApi.getRowNode(this.id);
      if(node){
        this.getAllRows().then(res => {
          if(res[0] && res[0].data && res[0].data.isAdded){
            res[0].setRowHeight(currentRowHeight + 28)
            this.tagService.currentRowHeight = currentRowHeight + 28;
          }else if(this.tagAction === 'edit'){
            node.setRowHeight(currentRowHeight + 28)
            this.tagService.currentRowHeight = currentRowHeight + 28;
          }else{
            node.setRowHeight(height);
            this.tagService.currentRowHeight = height;
          }
        });
      }
    })
  }
  getAllRows() {
    let rowData = [];
    this.gridApi.forEachNode(node => rowData.push(node));
    return new Promise(function (resolve) {
      resolve(rowData);
    });
  }

  // @reason : Delete tags on non editable state
  // @author : Ammshathwan
  // @date : 17th nov 2021
  removeSelectedtag(tag: Tag):void{
    var modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    let message1 = this.getLanguageKey("You are about to remove a sub tag") ? this.getLanguageKey("You are about to remove a sub tag") : "You are about to remove a sub tag "
    let message2 = this.getLanguageKey("from Tag") ? this.getLanguageKey("from Tag") : " from Tag ";
    modalInstanceDel.componentInstance.title = message1 + (tag && tag.content) + message2 + (this.rowDataOld && this.rowDataOld.tag && this.rowDataOld.tag.content);
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        this.tagElem.toArray().forEach((child) => {
          if(child && child.nativeElement && child.nativeElement.classList){
            child.nativeElement.classList.remove('d-none')
          }
        })
        this.isInputEmpty = true;
        const subArrayIndex = this.selectedTag.indexOf(tag);
        const hidenArrayIndex = this.hiddenTag.indexOf(tag);
        if (subArrayIndex >= 0) {
          this.selectedTag.splice(subArrayIndex, 1);
          this.newTags = this.selectedTag;
          this.hiddenTag = [];
          this.handleOverlapingTags();
        }
        if (hidenArrayIndex >= 0) {
          this.hiddenTag.splice(hidenArrayIndex, 1);
        }
        this.filterTags();
        this.updateTagData();
        const data: TagGridData = this.rowData;
        if (data) {
          const tagData = this.getUpdatedTag(data);
            this.updateTags(tagData).then(res => {
              let message  = this.getLanguageKey("has been successfully removed") ? this.getLanguageKey("has been successfully removed") : " has been successfully removed";
              this.sharedService.showFlashMessage(tag.content + message, "success");
            });
        }
      }
    })
  }

  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  // @reason : Process and get the updated tags inorder to process th BE opeations
  // @author : Ammshathwan
  // @date : 17th nov 2021
  private getUpdatedTag(data: TagGridData): TagEdit {
    const tagData: TagEdit = {
      id: data.tag.id,
      content: data.tag.content,
      entity_type: data.tag.entity_type,
      color_code: data.tag.color_code? data.tag.color_code : '#545454',
      added_sub_tags: [],
      deleted_sub_tags: []
    };
    data.sub_tags.forEach(subTag => {
      const oldSubTag = this.rowDataOld.sub_tags.find(tag => tag.id === subTag.id);
      if (!oldSubTag) {
        tagData.added_sub_tags.push(subTag.id);
      }
    });
    this.rowDataOld.sub_tags.forEach(subTag => {
      const newSubTag = data.sub_tags.find(tag => tag.id === subTag.id);
      if (!newSubTag) {
        tagData.deleted_sub_tags.push(subTag.id);
      }
    });
    return tagData;
  }

  public trackById(_, item): string {
    return item.id;
  }

  // @reason : update the selected tag in BE
  // @author : Ammshathwan
  // @date : 17th nov 2021
  private updateTags(tags: TagEdit): Promise<Tag> {
    return this.tagService.updateTags(tags);
  }
}
