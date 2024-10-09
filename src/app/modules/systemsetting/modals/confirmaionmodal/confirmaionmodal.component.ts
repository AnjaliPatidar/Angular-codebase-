import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmaionmodal',
  templateUrl: './confirmaionmodal.component.html',
  styleUrls: ['./confirmaionmodal.component.scss']
})
export class ConfirmaionmodalComponent implements OnInit {
  @Input() public typeOfmodal;
  @Input() public rowdata;
  @Input('title') title;
  @Input('deleteTitle') deleteTitle?;
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
