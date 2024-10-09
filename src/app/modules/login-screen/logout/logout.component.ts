import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {View} from '@app/modules/login-screen/login-screen.component';
import {AppConstants} from '@app/app.constant';
import { WINDOW } from '../../../core/tokens/window';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  @Output() onNavigation = new EventEmitter<View>();

  constructor(
    @Inject(WINDOW) private readonly window: Window
  ) { }

  onBackToLogin() {
    this.window.location.href = AppConstants.Ehub_Rest_API + '/security/init'
  }

}
