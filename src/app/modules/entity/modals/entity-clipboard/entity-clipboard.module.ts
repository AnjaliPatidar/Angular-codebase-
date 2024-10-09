import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityClipboardComponent } from './entity-clipboard.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '@app/shared/material.module';
import { EntityFunctionService } from '../../services/entity-functions.service';

@NgModule({
  declarations: [EntityClipboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    MaterialModule
  ],
  exports: [EntityClipboardComponent],
  providers: [
    EntityFunctionService
  ],
})
export class EntityClipboardModule {}
