import { NgModule } from '@angular/core';
import { DateTranslatedPipe } from '@app/common-modules/pipes/date-translated/date-translated.pipe';

@NgModule({
    declarations: [DateTranslatedPipe],
    exports: [DateTranslatedPipe]
})
export class DateTranslatedPipeModule {}
