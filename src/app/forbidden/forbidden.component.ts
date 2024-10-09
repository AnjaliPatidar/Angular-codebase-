import { Component, Inject, OnInit } from '@angular/core';
import { WINDOW } from '../core/tokens/window';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent {

  constructor(
    @Inject(WINDOW) private readonly window: Window
  ) { }

  navigateToPath(url: string){
    let paths: string = localStorage.getItem('paths');
    if (paths) {
      paths = JSON.parse(paths);
      this.window.location.href = paths['EHUB_FE_API'] + url;
    }
  }

}
