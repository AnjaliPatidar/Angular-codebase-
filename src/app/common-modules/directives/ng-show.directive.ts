import { Directive, ElementRef, Input } from '@angular/core';


@Directive({
    selector: '[ng-show]'
})
export class ngShowDirective {
    constructor(
        private elRef: ElementRef
    ) { }

    @Input('ng-show') set handle(condition: boolean) {
        if (condition) {
            this.elRef.nativeElement.style.display = "block";
        } else {
            this.elRef.nativeElement.style.display = "none";
        }
    }
}