import { CaseManagementService } from '@app/modules/case-management/case-management.service';
import { Component, OnInit } from '@angular/core';
import '../../../../../../assets/mock/icon.json'

@Component({
  selector: 'app-case-file-name',
  templateUrl: './case-file-name.component.html',
  styleUrls: ['./case-file-name.component.scss']
})
export class CaseFileNameComponent implements OnInit {
  public iconDetail: any;
  title;

  constructor(private caseManagementService:CaseManagementService) { }

  ngOnInit() {
  }

  agInit(params: any){
    if (params && params.data) {
      this.caseManagementService.getIconList().then(icons => {
        this.iconDetail = icons.find(element => element.format === params.data['FileType']) || icons.find(element => element.format === params.data.Operations['format']);
      })
      this.title = params.data.Operations.title ? params.data.Operations.title : 'There is no file attached'
    }
  }

}
