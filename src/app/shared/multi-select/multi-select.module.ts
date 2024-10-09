import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CoreMultiSelectComponent } from "./components/multi-select.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [CoreMultiSelectComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    TranslateModule.forChild(),
  ],
  exports: [CoreMultiSelectComponent],
})
export class CoreMultiSelectModule {}
