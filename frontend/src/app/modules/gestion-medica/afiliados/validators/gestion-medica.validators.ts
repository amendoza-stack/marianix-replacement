import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class GestionMedicaValidators {
  static dni(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const clean = String(control.value).replace(/\D/g, '');
      return clean.length >= 7 && clean.length <= 8 ? null : { dniInvalido: true };
    };
  }

  static cuil(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const clean = String(control.value).replace(/\D/g, '');
      return clean.length === 11 ? null : { cuilInvalido: true };
    };
  }

  static matricula(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const val = String(control.value).trim();
      return val.length >= 3 && val.length <= 15 ? null : { matriculaInvalida: true };
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(control.value) ? null : { emailInvalido: true };
    };
  }
}
