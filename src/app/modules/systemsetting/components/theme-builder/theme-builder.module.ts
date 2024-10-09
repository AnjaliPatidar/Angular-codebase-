import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThemeBuilderComponent} from '@app/modules/systemsetting/components/theme-builder/theme-builder.component';
import {RouterModule, Routes} from '@angular/router';
import 'bst-theme-builder/theme-builder';
const routes: Routes = [{
  path: '',
  component: ThemeBuilderComponent,
}];


@NgModule({
  declarations: [ThemeBuilderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [ThemeBuilderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]})
export class ThemeBuilderModule { }
