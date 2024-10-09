import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles-assigned-users',
  templateUrl: './roles-assigned-users.component.html',
  styleUrls: ['./roles-assigned-users.component.sass']
})
export class RolesAssignedUsersComponent implements OnInit {
  assigning = "FromRoles";
  
  constructor() { }

  ngOnInit() {
  
  }

}
