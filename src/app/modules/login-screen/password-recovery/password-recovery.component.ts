import {Component, EventEmitter, OnInit, Output,} from '@angular/core';
import {View} from '../login-screen.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '@app/modules/login-screen/authentication.service';

@Component({
    selector: 'app-password-recovery',
    templateUrl: './password-recovery.component.html',
    styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit {

    @Output() onNavigation = new EventEmitter<View>();

    form = new FormGroup({
        username: new FormControl(''),
        email: new FormControl('', [Validators.email])
    });

    disabled = false;

    constructor(private authService: AuthenticationService) { }

    ngOnInit() {
    }

    onBackToLogin() {
        this.onNavigation.emit('LOGIN');
    }

    recoverPassword() {
        this.disable();

        this.authService.recover(this.form.get('username').value, this.form.get('email').value).subscribe({
            next: (response) => {
                this.onNavigation.emit('RECOVERY_SUCCESS');
            },
            error: (error) => {
                this.enable();
                this.onNavigation.emit('ERROR');
            }
        });
    }

    canSubmit(): boolean {
        return this.form.valid && (this.form.get("username").value || this.form.get("email").value);
    }

    valueChanged() {
        if (this.form.get("username").value) {
            this.form.get("email").disable();
        } else {
            this.form.get("email").enable();
        }
        if (this.form.get("email").value) {
            this.form.get("username").disable();
        } else {
            this.form.get("username").enable();
        }
    }

    disable() {
        this.disabled = true;
        this.form.disable();
    }

    enable() {
        this.disabled = false;
        this.form.enable();
    }

}
