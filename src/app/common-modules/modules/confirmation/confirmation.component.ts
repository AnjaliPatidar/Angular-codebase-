import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})

export class ConfirmationComponent implements OnInit {
  @Output() emitData: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal:NgbActiveModal) { }
 @Input('statusComment') public statusComment = 'SureContinue'
  ngOnInit() {
  }
  appoveConfirm(type){
      this.emitData.emit(type);
      this.activeModal.dismiss();
  }
}
