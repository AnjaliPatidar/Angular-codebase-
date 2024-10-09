import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { isNumber } from 'lodash-es';

const languageDictionary = [
    {
        key: 'en',
        value: 'english'
    },
    {
        key: 'de',
        value: 'german'
    }
];

@Pipe({
    name: 'dateTranslated',
})
export class DateTranslatedPipe implements PipeTransform {
    constructor(private translateService: TranslateService, private sharedServicesService : SharedServicesService) {
    }

    /**
     * @description Can be used with moment formats, it is coming from sharedServicesService.dateFormatValue
     *              Can be used with DatePipe formats
     *              Can be overridden by dateFormatToOverride
     * @param value
     * @param dateFormatToOverride: override the dateFormat, dateFormats to use: 'DD-MMM-YYYY', 'DD.MM.YY', check moment documentation
     * @param isDatePipeFormat: use this to use DatePipe, dateFormats to use: 'fullDate', 'GlobalConstants.globalDateFormat.LongDateFormat', check DatePipe documentation
     * @param emptyValueToOverride: a date pattern (moment or DatePipe)
     */
    public transform(value: string | Date, dateFormatToOverride?: string, isDatePipeFormat?: boolean, emptyValueToOverride?: string): Observable<string> {
        if (isNumber(value)) {
            value = new Date(value);
        }
        const currentLangUrl = this.translateService.currentLang;
        const matches = currentLangUrl.match(/languageName=([^&]*)/);
        const match = (matches && matches[1]) || 'English';
        const currentLang = languageDictionary.find((o) => o.value === match.toLowerCase());
        const currentLangKey = currentLang.key || 'en';
        
        const o$ = !!isDatePipeFormat ? of('fullDate') : this.sharedServicesService.dateFormatValue;
        
        return o$.pipe(
            map((dateFormat) => {
                if (!!isDatePipeFormat) {
                    const datePipe = new DatePipe(currentLangKey);
                    return value ? datePipe.transform(value, dateFormatToOverride || dateFormat) : (emptyValueToOverride || '—');
                } else {
                    moment.locale(currentLangKey);
                    return value ? moment(value).format(dateFormatToOverride || dateFormat || 'DD/MM/YYYY') : (emptyValueToOverride || '—');
                }
            })
        );
    }
}
