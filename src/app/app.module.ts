import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MyMissingTranslationHandler} from '../app/shared-services/translation.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopPannelComponent } from './common-modules/modules/top-pannel/top-pannel.component';
import { PageNotFoundComponentComponent } from './pageNotFoundComponent/page-not-found-component.component';
import { AppConstants } from "@app/app.constant";
import { StickyNotesComponent } from './common-modules/modules/top-pannel/sticky-notes/sticky-notes.component';
import { MaterialModule } from './shared/material.module';
import { SubmenuModule } from './common-modules/modules/sub-menu/submenu.module';
import { NouisliderModule } from 'ng2-nouislider';
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { LyThemeModule, LY_THEME } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { PoliciesComponent } from './modules/user-management/components/manage/users/settings/policies/policies.component';
import { AlertCommentsModule } from './common-modules/modules/alerts-comments/alert-comments.module';
import { AboutComponent } from './common-modules/modules/top-pannel/modals/about/about.component';
import { PreferencesComponent } from './common-modules/modules/top-pannel/modals/preferences/preferences.component';
import { UserService } from './modules/user-management/services/user.service';
import { UtilitiesService } from './modules/user-management/services/utilities/utilities.service';
import { TitleCasePipe } from '@angular/common';
import { MatPaginatorIntlCro } from './shared/custom-mat-paginator';
import { ToastModule } from './common-modules/modules/toast/toast.module';
import { MainScreenComponent } from '@app/main-screen/main-screen.component';
import { LoginScreenModule } from '@app/modules/login-screen/login-screen.module';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { InterceptorService } from './shared-services/interceptor.service';

export function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    AppComponent,
    TopPannelComponent,
    AboutComponent,
    PageNotFoundComponentComponent,
    StickyNotesComponent,
    PoliciesComponent,
    PreferencesComponent,
    MainScreenComponent,
    ForbiddenComponent
  ],
  imports: [
    LoginScreenModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    DragDropModule,
    AngularMultiSelectModule,
    NgxMatSelectSearchModule,
    AppRoutingModule,
    SubmenuModule,
    NouisliderModule,
    AlertCommentsModule,
    NgFlashMessagesModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (childTranslateLoader),
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler
      }
    }),
    MaterialModule,
    LyThemeModule.setTheme('minima-light'),
    ToastModule.forRoot()
  ],
  providers: [AppConstants, TitleCasePipe,
    {
      provide: LY_THEME,
      useClass: MinimaLight,
      multi: true
    },
    {
      provide: LY_THEME,
      useClass: MinimaDark,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    UserService,
    UtilitiesService, { provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro}],
  exports: [
    TranslateModule
     ],
  bootstrap: [AppComponent],
  entryComponents:[
    AboutComponent,
    PreferencesComponent,

  ]
})
export class AppModule {
  constructor() {}
}
