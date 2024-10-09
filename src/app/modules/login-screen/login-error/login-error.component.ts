import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {View} from '../login-screen.component';
import {AppConstants} from '@app/app.constant';
import { WINDOW } from '../../../core/tokens/window';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent {

  @Output() onNavigation = new EventEmitter<View>();

  constructor(
    @Inject(WINDOW) private readonly window: Window
  ) { }

  onBackToLogin() {
    this.window.location.href = `${AppConstants.Ehub_Rest_API}/security/init`;
  }

}
