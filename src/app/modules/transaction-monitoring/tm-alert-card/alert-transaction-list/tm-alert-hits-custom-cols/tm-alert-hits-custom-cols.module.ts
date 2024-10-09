import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmAlertCardHitHyperlinkComponent } from './tm-alert-card-hit-hyperlink/tm-alert-card-hit-hyperlink.component';
import { HitRulesColumnComponent } from './hit-rules-column/hit-rules-column.component';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [TmAlertCardHitHyperlinkComponent, HitRulesColumnComponent],
    imports: [
        CommonModule,
        NgbPopoverModule,
        TranslateModule,
    ],
  entryComponents: [TmAlertCardHitHyperlinkComponent, HitRulesColumnComponent]
})
export class TmAlertHitsCustomColsModule { }
