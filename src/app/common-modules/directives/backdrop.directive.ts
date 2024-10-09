import { Directive, DoCheck, Input } from "@angular/core";
import { MatSelect } from "@angular/material/select";

@Directive({
  selector: "[appBackdropClass]",
})
export class PanelBackDropClassDirective implements DoCheck {
  @Input("appBackdropClass") bstGroupPanelBackdrop: string;

  constructor(private _host: MatSelect) {}

  ngDoCheck(): void {
    if (this._host.overlayDir) {
      this._host.overlayDir.hasBackdrop = true;
      this._host.overlayDir.backdropClass = this.bstGroupPanelBackdrop;
    }
  }
}
