import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-auditing-list',
  templateUrl: './auditing-list.component.html',
  styleUrls: ['./auditing-list.component.scss']
})
export class AuditingListComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Input() isOpenModalPanel: boolean = false;
  @Output() isOpenChangedAudit: EventEmitter<boolean> = new EventEmitter();
  @Output() isOpenModalPanelChanged: EventEmitter<boolean> = new EventEmitter();
    
  searchField: string = "";
  searchTextboxControl = new FormControl();
  panelOpenState: boolean = false;
  audit_list: any[] = [];

  userFilter: any = { month: '' };

  constructor() { }

  ngOnInit() {

    this.audit_list = [
      {
        month: 'November 2022',
        date: 'November 15',
        des01: 'PEP Alerts(3) aaaaa',
        des02: 'Sunction Alerts',
        des03: 'Analyst changed date',
        des04: 'analyst2 deleted comment',
        des05: 'analyst commented',
        des06: 'Sunction Alert occured',
        des07: 'Analyst changed date',
      },
      {
        month: 'October 2022',
        date: 'October 15',
        des01: 'PEP Alerts(3)',
        des02: 'Sunction Alerts',
        des03: 'Analyst changed date',
        des04: 'analyst2 deleted comment',
        des05: 'analyst commented',
        des06: 'Sunction Alert occured',
        des07: 'Analyst changed date',
      }
    ];

  }


  close() {
    if (this.isOpen) {
      this.isOpen = false;
      this.isOpenChangedAudit.emit(this.isOpen);
    } else if (this.isOpenModalPanel) {
      this.isOpenModalPanel = false;
      this.isOpenModalPanelChanged.emit(this.isOpenModalPanel);
    }
  }


  onKey(value: string) {
    let filter = value.toLowerCase();
    // return this.audit_list.filter(option =>
    //   option.des01.toLocaleLowerCase().includes(filter)
    // );

    // return this.students.filter(s => s.reg === value)
  }

  searchSingle(value: string) {
    let filter = value.toLowerCase();
    // return this.commentData.filter(option =>
    //   option.comment.toLowerCase().includes(filter) || option.user_name.toLowerCase().includes(filter)
    // );
  }

  clearSearch(event) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  isOpenModalPanelChangedHandler() {
    this.isOpenModalPanelChanged.emit(this.isOpenModalPanel);
  }


}
