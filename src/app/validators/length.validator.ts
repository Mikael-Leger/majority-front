import { FormGroup } from '@angular/forms';
import { TypeValidator } from '../enums/type-validators.enum'

export function LengthValidator(controlName: string, type: TypeValidator) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];

    if (control.errors && !control.errors.validator) {
      return;
    }
    let maxLength: number = 0;
    let minLength: number = 0;
    switch (type) {
      case TypeValidator.Question:
        maxLength = 70;
        minLength = 6;
        break;
      case TypeValidator.Answer:
        maxLength = 13;
        minLength = 4;
        break;
      case TypeValidator.Username:
        maxLength = 12;
        minLength = 4;
        break;
      case TypeValidator.Password:
        maxLength = 20;
        minLength = 6;
        break;
      default:
        break;
    }
    if (control.value.length > maxLength) {
      control.setErrors({ validator: 'should not have more than ' + maxLength + ' characters' });

    } else if (control.value.length < minLength) {
      control.setErrors({ validator: 'should have at least ' + minLength + ' characters' });

    } else {
      control.setErrors(null);

    }
  }
}
