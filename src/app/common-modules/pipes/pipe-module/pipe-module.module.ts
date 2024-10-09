import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimestampSort } from '@app/common-modules/pipes/TimeStampSort.component';
import { CustomTextFilter } from '@app/common-modules/pipes/textFIlter.component';


@NgModule({
  declarations: [
    TimestampSort,
    CustomTextFilter
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TimestampSort,
    CustomTextFilter
  ]
})
export class PipeModuleModule { }
