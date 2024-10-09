import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { UserConstant } from '@app/modules/user-management/constants/ag-grid/user-table.constants';
@Component({
  selector: 'app-user-table-renderer',
  templateUrl: './user-table-renderer.component.html',
  styleUrls: ['./user-table-renderer.component.scss']
})
export class UserTableRendererComponent implements OnInit {
  public params: any;
  public gridApi: any;
  public currentRowData: any;
  public className: string;
  public imagePath: string;
  public fullName: string;
  public profileIcon: string;
  public statusObj: any;
  public roles: Array<any> = [];
  public groups: Array<any> = [];
  constructor(private utilitiesService: UtilitiesService) { }

  ngOnInit() {
  }
  agInit(params: any, event): void {
    if (params) {
      setTimeout(() => {
      this.params = params;
      this.gridApi = params.api;
      this.currentRowData = params && params.data ? params.data : {};
      this.className = params.colDef.class;
     
        if (this.className == "fullName") {
          let makeImage = (imgData) => {
            if (imgData) {
              let imageFile = this.utilitiesService.convertBase64ToJpeg(imgData);
              var reader = new FileReader();
              reader.onload = (e: any) => {
                this.imagePath = e.target.result;

              };
              reader.readAsDataURL(imageFile);
            }
            else {
              this.profileIcon = this.currentRowData.completeResponse['firstName'].charAt(0) + this.currentRowData.completeResponse['lastName'].charAt(0);
            }
          }
          if(this.currentRowData.completeResponse){
            makeImage(this.currentRowData.completeResponse['userImage']);
            this.fullName = this.currentRowData[UserConstant.fullName.field];
          }
         
        }
        else if (this.className == "status") {
          this.statusObj = this.currentRowData[UserConstant.status.field];
        }
        else if (this.className == "roles") {
          this.roles = this.currentRowData[UserConstant.roles.field];
        }
        else if (this.className == "groups") {
          this.groups = this.currentRowData[UserConstant.groups.field];
        }

    

    })
  }
  }
}
