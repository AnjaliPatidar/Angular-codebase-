import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { UtilitiesPanelComponent } from './utilities-panel.component';
import { MaterialModule } from '@app/shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
const routes : Routes = [
  {
    path:'',
    component:UtilitiesPanelComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports:[UtilitiesPanelComponent],
  declarations: [UtilitiesPanelComponent]
})
export class UtilitiesPanelModule { }
