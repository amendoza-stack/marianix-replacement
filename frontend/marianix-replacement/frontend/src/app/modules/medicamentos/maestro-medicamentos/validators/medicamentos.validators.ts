import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MedicamentosValidators {
  static descripcionUppercase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const val = String(control.value);
      if (val !== val.toUpperCase()) {
        control.setValue(val.toUpperCase(), { emitEvent: false });
      }
      return null;
    };
  }

  static codigoSSS(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const clean = String(control.value).trim();
      return clean.length >= 4 ? null : { codigoSSSInvalido: true };
    };
  }

  static codigoBarra(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const clean = String(control.value).replace(/\D/g, '');
      return clean.length >= 8 && clean.length <= 13 ? null : { codigoBarraInvalido: true };
    };
  }
}
