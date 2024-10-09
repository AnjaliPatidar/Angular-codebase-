import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {View} from '@app/modules/login-screen/login-screen.component';

@Component({
  selector: 'app-recovery-success',
  templateUrl: './recovery-success.component.html',
  styleUrls: ['./recovery-success.component.scss']
})
export class RecoverySuccessComponent implements OnInit {

  @Output() onNavigation = new EventEmitter<View>();

  constructor() { }

  ngOnInit() {
  }

  onBackToLogin() {
    this.onNavigation.emit('LOGIN');
  }

}
