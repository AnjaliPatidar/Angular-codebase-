import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: "app-enable-and-disable-alertmodal",
  templateUrl: "./enable-and-disable-alertmodal.component.html",
  styleUrls: ["./enable-and-disable-alertmodal.component.sass"],
})
export class EnableAndDisableAlertmodalComponent {
  constructor(public modal: NgbActiveModal) {}
}
