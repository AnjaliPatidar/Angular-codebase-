import { Component, OnInit } from '@angular/core';
import { CaseManagementService } from '@app/modules/case-management/case-management.service';

@Component({
  selector: 'app-case-tags-cell',
  templateUrl: './case-tags-cell.component.html',
  styleUrls: ['./case-tags-cell.component.scss']
})
export class CaseTagsCellComponent implements OnInit {
  tags: any[] = [];
  tagList: any[] = [];
  displayedTags: any = [];
  pendingCount: number;
  hiddenTagList: any = [];
  rowSelectedValDocID
  constructor(
    private _caseService: CaseManagementService
  ) { }

  ngOnInit() {

  }

  agInit(params: any): void {
    this._caseService.documentTagMappingListObserver.subscribe((list) => {
      this.tagList = list;
      this.tags = params && params.data && params.data.fileID ? this.getDocumentTag(params.data.fileID) : [];
      if (params) {
        if (params.data) {
          this.rowSelectedValDocID  = params && params.data;
          this.pendingCount = 0;
          this.displayedTags = this.tags && this.tags.slice(0, 2);
          this.pendingCount = this.tags && this.tags.length - 2;
        }
      }
      this.getHiddentagList();
    },(err) => {

    })

  }

  getHiddentagList():void{
    this.hiddenTagList = [];
    if(this.tags && this.tags.length && this.tags.length > 2){
      this.tags.forEach((tag , index) => {
        if(tag && index && index > 1){
          this.hiddenTagList.push(tag)
        }
      })
    }
  }

  getDocumentTag(fileId) {
    if (fileId) {
      var tags;
      let documentTags = [];
      if (Object.keys(this.tagList).find(ele => ele == fileId)) {
        this.tagList[fileId].forEach(tag => {
          if (tag) {
            let tagElement = tag.content ? tag.content : '';
            let subTagElement = tag.subtag ? ' : ' + tag.subtag['content'] : '';
            tags = {
              content: tagElement + subTagElement,
              color_code: tag.color_code ? tag.color_code : ''
            }
            documentTags.push(tags)
          } else {
            documentTags = [];
          }
        });
      }
      return documentTags;
    }
  }

  public trackByContent(_, item): string {
    return item.content;
  }
}

