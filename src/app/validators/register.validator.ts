import { FormGroup } from '@angular/forms';

export function EmailValidator(controlName: string){
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const conform = control.value.match(regex);
    if (control.errors) {
      return;
    }
    if (!conform) {
      control.setErrors({ validator: 'has to be valid' });

    } else {
      control.setErrors(null);

    }
  };
}

export function ConfirmedValidator(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.validator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ validator: 'Should match Password' });

    } else {
      matchingControl.setErrors(null);

    }
  }
}
