import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups-assigned-users',
  templateUrl: './groups-assigned-users.component.html',
  styleUrls: ['./groups-assigned-users.component.scss']
})
export class GroupsAssignedUsersComponent implements OnInit {
  assigning = "FromGroups";
  constructor() { }

  ngOnInit() {
  }

}
