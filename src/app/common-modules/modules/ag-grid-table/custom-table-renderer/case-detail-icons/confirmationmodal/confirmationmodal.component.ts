import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmaionmodal',
  templateUrl: './confirmationmodal.component.html',
  styleUrls: ['./confirmationmodal.component.sass']
})
export class ConfirmationmodalComponent implements OnInit {

  @Input('title') title;
  @Output() confirmationData: EventEmitter<any> = new EventEmitter();

  constructor(public activemodal :NgbActiveModal) { }

  ngOnInit() {
  }

  sendResponse(val) {
    this.confirmationData.emit(val);
    this.activemodal.close();
  }
}
