import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesComponent } from './modals/preferences/preferences.component';
import { TranslateModule } from "@ngx-translate/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

@NgModule({
  declarations: [PreferencesComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
  ]
})
export class TopPannelModule { }
