import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedAlertsComponent } from '../related-alerts/related-alerts.component';
import { MaterialModule } from '../../../shared/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { DateTranslatedPipeModule } from '@app/common-modules/pipes/date-translated/date-translated-pipe.module';

@NgModule({
  declarations: [RelatedAlertsComponent],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        TranslateModule,
        DateTranslatedPipeModule,
    ],
  exports: [RelatedAlertsComponent]
})
export class RelatedAlertsModule { }
