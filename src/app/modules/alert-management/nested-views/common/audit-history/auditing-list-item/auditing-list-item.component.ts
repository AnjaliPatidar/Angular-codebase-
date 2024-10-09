import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-auditing-list-item',
  templateUrl: './auditing-list-item.component.html',
  styleUrls: ['./auditing-list-item.component.scss']
})
export class AuditingListItemComponent implements OnInit {

  subPanelOpenState: boolean = false;
  panelOpenState: boolean = false;
  @Input() audit_list: any[] = [];

  constructor() { }

  ngOnInit() {
  }

}
