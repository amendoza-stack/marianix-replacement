import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class TablasAuxiliaresValidators {
  static codigoMaxLength(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return String(control.value).trim().length > max ? { codigoMaxLength: { max } } : null;
    };
  }

  static descripcionTrimUppercase(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const val = String(control.value);
    if (val.trim().length === 0) return { required: true };
    if (val !== val.toUpperCase()) {
      control.setValue(val.toUpperCase(), { emitEvent: false });
    }
    return null;
  }

  static fechaRangoValido(control: AbstractControl): ValidationErrors | null {
    const desde = control.get('fechaDesde')?.value;
    const hasta = control.get('fechaHasta')?.value;
    if (desde && hasta) {
      const d1 = new Date(desde);
      const d2 = new Date(hasta);
      if (d2 <= d1) {
        return { fechaRangoInvalido: true };
      }
    }
    return null;
  }
}
