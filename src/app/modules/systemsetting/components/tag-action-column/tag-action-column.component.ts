import { Component } from '@angular/core';
import { AgGridTableService } from '@app/common-modules/modules/ag-grid-table/ag-grid-table.service';
import { CommonServicesService } from '@app/common-modules/services/common-services.service';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmaionmodalComponent } from '../../modals/confirmaionmodal/confirmaionmodal.component';
import { TagCreate } from '../../models/tag-management/tag-create.model';
import { TagDelete } from '../../models/tag-management/tag-delete';
import { TagEdit } from '../../models/tag-management/tag-edit.model';
import { TagGridData } from '../../models/tag-management/tag-grid-data.model';
import { Tag } from '../../models/tag-management/tag.model';
import { TagManagementApiService } from '../../services/tag-management.api.service';
import { GlobalConstants } from '@app/common-modules/constants/global.constants';

@Component({
  selector: 'app-tag-action-column',
  templateUrl: './tag-action-column.component.html',
  styleUrls: ['./tag-action-column.component.scss']
})
export class TagActionColumnComponent {
  isEditMode: boolean;
  gridApi: any;
  rowData: TagGridData;
  rowDataOld: TagGridData;
  id: string;
  isNew: boolean;
  isDisable:boolean;
  params

  constructor(
    private agGridTableService: AgGridTableService,
    private tagManagementApiService: TagManagementApiService,
    public modalservice: NgbModal,
    public sharedService: SharedServicesService,
    private commonServicesService: CommonServicesService) {
     }

  agInit(params: any): void {
    if (params) {
      this.params = params;
      if (params.node) {
        this.gridApi = params.node.gridApi;
        this.id = params.node.id;
      }
      if (params.data) {
        this.rowData = params.data;
        this.rowDataOld = JSON.parse(JSON.stringify(this.rowData));
        this.isEditMode = (params.data.enableInput);
        if (this.isEditMode) {
          this.isNew = true;
          this.agGridTableService.addEditTagData({ action: 'add', id: this.id });
        }
      }
    }
  }

  onEdit(): void {
    this.isEditMode = true;
    const itemsToUpdate = [];
    if (this.id) {
      this.agGridTableService.addEditTagData({ action: 'edit', id: this.id });
    }
  }

  getLanguageKey(text) {
    var langKey = text;
    if (GlobalConstants.languageJson) {
      langKey = GlobalConstants.languageJson[text];
    }
    return langKey;
  }

  onDelete(): void {
    var modalInstanceDel = this.modalservice.open(ConfirmaionmodalComponent, {
      windowClass:
        "custom-modal c-arrow center bst_modal add-ownership-modal add-new-officer",
    });
    let message = this.getLanguageKey("You are about to delete tag") ? this.getLanguageKey("You are about to delete tag") : "You are about to delete tag ";
    modalInstanceDel.componentInstance.title = message + (this.rowData && this.rowData.tag && this.rowData.tag.content);
    modalInstanceDel.componentInstance.confirmationData.subscribe((resp) => {
      if (resp) {
        if (this.gridApi) {
          this.gridApi.updateRowData({ remove: [this.rowData] });
          let subtagIds = [];
          this.rowData.sub_tags.forEach(element => {
            if (element) {
              subtagIds.push(element.id)
            }
          })

          const tagData: TagDelete = {
            maintagId: this.rowData.tag.id, subtagId: subtagIds
          };
          if (!this.isNew) {
            this.deleteTags(tagData).then(res => {
              let message = `${this.getLanguageKey("Tag") ? this.getLanguageKey("Tag") : "Tag"} ${this.rowData.tag.content} ${this.getLanguageKey("deleted successfully") ? this.getLanguageKey("deleted successfully") : "deleted successfully"}`;
              this.sharedService.showFlashMessage(message, "success");
              this.gridRefresh();
            });
          }
        }
      }
    });
  }

  onSave(): void {
    if (this.id) {
      this.agGridTableService.addEditTagData({ action: 'save', id: this.id });
      const data: TagGridData = this.rowData;
      if (data && data.isValid) {
        this.isEditMode = false;
        if (this.isNew && data.tag && data.tag.content && data.tag.entity_type) {
          const tagData = this.getCreatedTag(data);
          this.createTags([tagData]).then(res => {
            let message = this.getLanguageKey("has been added successfully") ? this.getLanguageKey("has been added successfully") : " has been added successfully";
            this.sharedService.showFlashMessage(tagData.content + message, "success");
            this.gridRefresh();
          });
        } else {
          const tagData = this.getUpdatedTag(data);
          this.updateTags(tagData).then(res => {
            let message = this.getLanguageKey("has been successfully updated") ? this.getLanguageKey("has been successfully updated") : " has been successfully updated";
            this.sharedService.showFlashMessage(tagData.content + message, "success");
            this.gridRefresh();
          });
        }
      }
    }
  }

  private getCreatedTag(data: TagGridData): TagCreate {
    const tagData: TagCreate = {
      content: data.tag.content,
      entity_type: data.tag.entity_type,
      color_code: data.tag.color_code ? data.tag.color_code : '#545454',
      sub_tags: data.sub_tags.map(tag => tag.id)
    };
    return tagData;
  }

  private getUpdatedTag(data: TagGridData): TagEdit {
    const tagData: TagEdit = {
      id: data.tag.id, content: data.tag.content, entity_type: data.tag.entity_type,
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

  onCancel(): void {
    this.isEditMode = false;
    if (this.id) {
      if (this.isNew && this.gridApi) {
        this.gridApi.updateRowData({ remove: this.rowData });
      }
      this.gridRefresh();
      this.agGridTableService.addEditTagData({ action: 'cancel', id: this.id });
    }
  }


  private gridRefresh(): void {
    this.commonServicesService.reloadPageConetnt();
  }

  private createTags(tags: Array<TagCreate>): Promise<Array<Tag>> {
    return this.tagManagementApiService.createTags(tags);
  }

  private updateTags(tags: TagEdit): Promise<Tag> {
    return this.tagManagementApiService.updateTags(tags);
  }

  private deleteTags(tags: TagDelete): Promise<any> {
    return this.tagManagementApiService.deleteTags(tags);
  }
}
