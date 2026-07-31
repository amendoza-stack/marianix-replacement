import os
import re

root_dir = r"C:\Users\aname\marianix-replacement"
frontend_src = os.path.join(root_dir, "frontend", "src", "app")

print("⚡ Iniciando Desacoplamiento de Mocks e Higienización de Servicios Angular 17...")

# 1. GENERACIÓN DEL INTERCEPTOR DE ERRORES HTTP CENTRALIZADO (services/http-error.interceptor.ts)
interceptor_dir = os.path.join(frontend_src, "core", "interceptors")
os.makedirs(interceptor_dir, exist_ok=True)

interceptor_code = """import { Injectable, inject } from '@angular/core';
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
"""

with open(os.path.join(interceptor_dir, "http-error.interceptor.ts"), "w", encoding="utf-8") as f:
    f.write(interceptor_code)

print("✅ Interceptor de errores HTTP centralizado generado correctamente.")

# 2. PURGA DE FALLBACKS DE MOCK EN SERVICIOS
services_dir = os.path.join(frontend_src, "services")
cleaned_services = []

if os.path.exists(services_dir):
    for root, dirs, files in os.walk(services_dir):
        for file in files:
            if file.endswith(".ts"):
                path = os.path.join(root, file)
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                
                original = content
                # Erradicar catchError que devuelvan fallbacks estáticos de mock
                content = re.sub(
                    r'catchError\([^)]*\)\s*=>\s*of\([^)]*\)',
                    'catchError(err => throwError(() => err))',
                    content
                )
                
                if content != original:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(content)
                    cleaned_services.append(file)

print(f"✅ Higienización de servicios completada. Servicios actualizados a REST puro: {len(cleaned_services)}")
