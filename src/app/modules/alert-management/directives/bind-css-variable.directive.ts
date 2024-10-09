import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appBindCssVariable]'
})
export class BindCssVariableDirective {

  @Input() set bindCssVariableValue(bindCssVariableValue){
    this.host.nativeElement.style
    let parentElement = this.host.nativeElement;
    this.host.nativeElement.style.backgroundColor = bindCssVariableValue.bgColor;
    parentElement.children[0]['style'].color = bindCssVariableValue.iconColor;
  };

  constructor(private host: ElementRef<HTMLElement>) {}

}
