import {NgModule} from '@angular/core';
import {LoginScreenComponent} from './login-screen.component';
import {PasswordRecoveryComponent} from './password-recovery/password-recovery.component';
import {UsernamePasswordLoginComponent} from './username-password-login/username-password-login.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoginErrorComponent } from './login-error/login-error.component';
import {MaterialModule} from '@app/shared/material.module';
import { LogoutComponent } from './logout/logout.component';
import { RecoverySuccessComponent } from './recovery-success/recovery-success.component';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {MyMissingTranslationHandler} from '@app/shared-services/translation.service';
import { LoginProblemComponent } from './login-problem/login-problem.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

function childTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '', '');
}

@NgModule({
  declarations: [
    LoginScreenComponent,
    PasswordRecoveryComponent,
    UsernamePasswordLoginComponent,
    LoginErrorComponent,
    LogoutComponent,
    RecoverySuccessComponent,
    LoginProblemComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (childTranslateLoader),
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MyMissingTranslationHandler
      },
      isolate: true
    }),
  ],
  exports: [LoginScreenComponent]
})
export class LoginScreenModule { }
