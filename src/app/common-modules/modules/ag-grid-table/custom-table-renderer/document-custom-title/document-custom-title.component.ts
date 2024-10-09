import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-custom-title',
  templateUrl: './document-custom-title.component.html',
  styleUrls: ['./document-custom-title.component.scss']
})
export class DocumentCustomTitleComponent implements OnInit {
  documentData
  iconDetail
  constructor(private caseManagementService:CaseManagementService) { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.documentData = params && params.data ? params.data : '';
    this.getIconsToDocument();
  }

  getIconsToDocument():void{
    this.caseManagementService.getIconList().then((iconList) => {
      const docFormat:string = this.documentData && this.documentData.title && this.documentData.title.format ? this.documentData.title.format : ''
      if(docFormat){
        this.iconDetail = iconList.find(icon => icon.format.toLowerCase() ===  docFormat.toLowerCase())
      }
    })
  }

}
