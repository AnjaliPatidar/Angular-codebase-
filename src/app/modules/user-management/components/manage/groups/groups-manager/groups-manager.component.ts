import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from '@app/modules/user-management/services/groups.service';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { ObserverService } from '@app/modules/user-management/services/observer.service';
@Component({
  selector: 'app-groups-manager',
  templateUrl: './groups-manager.component.html',
  styleUrls: ['./groups-manager.component.scss']
})
export class GroupsManagerComponent implements OnInit {
public currentGroup:any;
  public cloneGroup: any;
  public groupDetails:any={};
  public assignUsersCount:any;
  constructor(private route: ActivatedRoute,
     private utilityService : UtilitiesService,
     private observerService :ObserverService,
    private groupsService:GroupsService) { }

  ngOnInit() {
    this.route.firstChild.params.subscribe(params => {
      this.currentGroup = decodeURIComponent(params['currentGroup']);
       this.getGroupDetails(this.currentGroup);
    });
    this.route.firstChild.queryParams.subscribe(params => {
      this.cloneGroup =  params.groupName
    });
    this.getAssignedUserCount();
  }
  ngAfterContentInit(){

  }
  settingUrl(){
    return `/element/user-management/manage/groups/settings/${encodeURIComponent(this.currentGroup)}`
  }

  assignedUsersUrl(){
    return `/element/user-management/manage/groups/assigned-users/${encodeURIComponent(this.currentGroup)}`
  }
  getGroupDetails(groupName){
    this.groupsService.getGroup({groupName : groupName})
    .then((response:any)=>{
      if(response && response.data && response.data.id){
        this.groupDetails['description'] = response.data.description;
        this.groupDetails['groupId'] = response.data.id
        this.groupDetails['groupName'] = response.data.name;

        this.groupDetails['icon'] = response.data.icon;
        this.groupDetails['color'] = response.data.color;
        this.groupDetails['remarks']= response.data.remarks;
         this.getAssignedUsers();
      }
      else{
        //this.utilitiesService.openSnackBar("error", "Invalid rolename");
      }
    })
    .catch((err)=>{
      //this.utilitiesService.openSnackBar("error", "something went wrong");
    })
  }
  getAssignedUsers(){
    let params = {
      groupId:  this.groupDetails['groupId']
    }
    this.utilityService.getAssignedUserCount(params);
    this.getAssignedUserCount();

  }

  getAssignedUserCount(){
    this.observerService.assignedUser.subscribe((data: any) => {
      if (data) {
        this.assignUsersCount=data
      }
    })
  }
}
