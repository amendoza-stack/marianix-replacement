import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'Ocurrió un error inesperado en la comunicación con la API.';
        
        if (error.error && typeof error.error.detail === 'string') {
          errorMsg = error.error.detail;
        } else if (error.status === 401) {
          errorMsg = 'Sesión expirada o credenciales inválidas (401).';
        } else if (error.status === 403) {
          errorMsg = 'Acceso denegado: No posee los permisos requeridos (403).';
        } else if (error.status === 404) {
          errorMsg = 'El recurso solicitado no existe en el servidor (404).';
        } else if (error.status === 409) {
          errorMsg = 'Conflicto de duplicidad o regla de negocio (409).';
        } else if (error.status === 422) {
          errorMsg = 'Error de validación de formulario/datos en Backend (422).';
        } else if (error.status === 500) {
          errorMsg = 'Error interno en el servidor Backend (500).';
        }

        this.snackBar.open(errorMsg, 'Cerrar', {
          duration: 5000,
          panelClass: ['snackbar-error-theme'],
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });

        return throwError(() => error);
      })
    );
  }
}
