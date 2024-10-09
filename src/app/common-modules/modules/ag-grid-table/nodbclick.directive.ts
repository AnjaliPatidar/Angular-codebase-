import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNodbclick]'
})
export class NodbclickDirective {

  constructor() { }
  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.srcElement.parentElement.setAttribute('disabled', true);
    setTimeout(function () {
      event.srcElement.parentElement.removeAttribute('disabled');
    }, 20000);
  }
}
