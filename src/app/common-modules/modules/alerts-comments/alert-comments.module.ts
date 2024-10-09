import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertCommentsComponent } from './alert-comments.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MaterialModule } from '../../../shared/material.module'
import { RouterModule } from '@angular/router';
import { NgxCopyToClipboardModule } from 'ngx-copy-to-clipboard';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { RelatedAlertsModule } from '../related-alerts/related-alerts.module';
import { AlertCustomerInformationComponent } from './alert-customer-information/alert-customer-information.component';
import { DateTranslatedPipeModule } from '@app/common-modules/pipes/date-translated/date-translated-pipe.module';

@NgModule({
  declarations: [AlertCommentsComponent, ConfirmationComponent, AlertCustomerInformationComponent],
    imports: [
        FormsModule,
        CommonModule,
        RelatedAlertsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        TranslateModule,
        MaterialModule,
        RouterModule,
        NgxCopyToClipboardModule,
        NgMultiSelectDropDownModule.forRoot(),
        DateTranslatedPipeModule,
        NgxSliderModule
    ],
  exports: [AlertCommentsComponent, AlertCustomerInformationComponent],
  providers: [NgbActiveModal],
  entryComponents: [ConfirmationComponent, AlertCommentsComponent]
})
export class AlertCommentsModule { }
