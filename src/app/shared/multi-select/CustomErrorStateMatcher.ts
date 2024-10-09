import {FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null | undefined, form: FormGroupDirective | NgForm | null): boolean {
    if (control == null) {
      return false;
    }
    return control.invalid;
  }
}