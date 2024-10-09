import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { Routes, RouterModule } from '@angular/router';
import { DomainComponent } from './domain.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const routes: Routes = [
  {
    path:'',
    component:DomainComponent
  }
];

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [DomainComponent],
  imports: [
    CommonModule,
    NgbModule,
    DragDropModule,
    FormsModule,
    AngularMultiSelectModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (childTranslateLoader),
        deps: [HttpClient]
      },
      isolate: true
    }),
  ]
})
export class DomainModule { }
