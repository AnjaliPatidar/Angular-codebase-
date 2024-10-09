import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { SubMenuComponent } from './sub-menu.component';
import { UtilitiesPanelModule } from './utilities-panel/utilities-panel.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { EntitysourceevidenceComponent } from './entitysourceevidence/entitysourceevidence.component';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MaterialModule } from '@app/shared/material.module';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EntityClipboardModule } from '@app/modules/entity/modals/entity-clipboard/entity-clipboard.module';
import { AgGridTableModule } from '../ag-grid-table/ag-grid-table.module';

const routes: Routes = [
  {
    path: '',
    component: SubMenuComponent
  }
]

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UtilitiesPanelModule,
    NgbModule,
    FormsModule,
    MatSelectModule,
    TranslateModule,
    EntityClipboardModule,
    AgGridTableModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (childTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
  ],
  exports: [SubMenuComponent],
  declarations: [SubMenuComponent, BreadcrumbComponent, EntitysourceevidenceComponent]
})
export class SubmenuModule { }
