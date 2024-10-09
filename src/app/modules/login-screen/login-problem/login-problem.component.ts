import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {View} from '@app/modules/login-screen/login-screen.component';
import {AppConstants} from '@app/app.constant';
import { WINDOW } from '../../../core/tokens/window';

@Component({
  selector: 'app-login-problem',
  templateUrl: './login-problem.component.html',
  styleUrls: ['./login-problem.component.scss']
})
export class LoginProblemComponent {

  @Output() onNavigation = new EventEmitter<View>();

  @Input()
  problemCode: string;

  constructor(
    @Inject(WINDOW) private readonly window: Window
  ) { }

  onBackToLogin() {
    this.window.location.href = AppConstants.Ehub_Rest_API + '/security/init'
  }

}
