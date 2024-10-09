import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {
  }

  public getLightTheme() {
    return document.getElementsByClassName('light-dark-theme').length > 0;
  }
}
