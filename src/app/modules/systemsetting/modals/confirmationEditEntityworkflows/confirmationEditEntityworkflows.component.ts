import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmationEditEntityworkflows',
  templateUrl: './confirmationEditEntityworkflows.component.html',
  styleUrls: ['./confirmationEditEntityworkflows.component.scss']
})
export class ConfirmationEditEntityworkflowsComponent implements OnInit {
  @Input() public typeOfmodal;
  @Input() public rowdata;
  @Input('title') title;
  @Input('editTitle') editTitle?;
  @Input('isShowHeader') isShowHeader?;
  @Output() confirmationData: EventEmitter<any> = new EventEmitter();
  constructor(public activemodal :NgbActiveModal) { }

  ngOnInit() {
  }

  sendResponse(val) {
    this.confirmationData.emit(val);
    this.activemodal.close();
  }
}
