import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild,} from '@angular/core';
import {View} from '../login-screen.component';
import {AuthenticationService} from '../authentication.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {interval} from 'rxjs';
import { AppConstants } from '../../../app.constant';
import { WINDOW } from '../../../core/tokens/window';

@Component({
    selector: 'app-username-password-login',
    templateUrl: './username-password-login.component.html',
    styleUrls: ['./username-password-login.component.scss']
})
export class UsernamePasswordLoginComponent implements OnInit {

    @ViewChild('usernameInput', {read: ElementRef, static: false}) usernameInput!: ElementRef<HTMLElement>;

    @Output() onNavigation = new EventEmitter<View>();

    disabled = false;

    autofilled = false;

    hidePassword = true;

    form = new FormGroup({
        username: new FormControl(''),
        password: new FormControl('')
    });

    errorMatcher = new LoginErrorStateMatcher();

    constructor(
        private ref: ChangeDetectorRef,
        private authService: AuthenticationService,
        @Inject(WINDOW) private readonly window: Window
    ) { }

    ngOnInit() {

        if (AppConstants.paths.EHUB_FE_API === 'https://front.dev-toronto.xara.ai/' || AppConstants.paths.EHUB_FE_API === 'https://front.prestg-salzburg.xara.ai/') {
            this.window.location.href = AppConstants.Ehub_Rest_API + '/security/init'
        }

        const secondsCounter = interval(200);
        const subscription = secondsCounter.subscribe(n => {
            this.autofilled =  this.usernameInput && this.usernameInput.nativeElement.matches(":-internal-autofill-selected");
            if (this.autofilled) {
                subscription.unsubscribe();
                this.ref.detectChanges();
            }
        })
    }

    disable() {
        this.disabled = true;
        this.form.disable();
    }

    enable() {
        this.disabled = false;
        this.form.enable();
    }

    onPasswordRecovery() {
        this.onNavigation.emit('PASSWORD_RECOVERY');
    }

    canSignIn(): boolean {
        let formValid = this.form.valid
            && this.form.get("username").value.length > 0
            && this.form.get("password").value.length > 0;

        return formValid || this.autofilled;
    }

    signIn() {
        this.disable();

        this.authService.login(this.form.get('username').value, this.form.get('password').value).subscribe({
            next: (response) => {
                localStorage.setItem("ehubObject", JSON.stringify(response));
                this.window.location.href = (response as any)['defaultUrl'];
            },
            error: (error) => {
                this.enable();
                if (error && error.status == 400) {
                    this.form.setErrors({rejected: true});
                } else {
                    this.onNavigation.emit('ERROR');
                }
            }
        });
    }
}

export class LoginErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(form && form.invalid && control && (control.dirty || control.touched || isSubmitted));
    }
}
