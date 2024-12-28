import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const router = inject(Router); 
  
    console.log('Interceptando solicitud...', { token });
  
    if (!token) {
      console.warn('Token no disponible. Redirigiendo al login...');
      localStorage.clear();
      router.navigate(['/login']);
      return throwError(() => new Error('Token no disponible.'));
    }
  
    const clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  
    return next(clonedRequest).pipe(
      catchError((error) => {
        console.error('Error en la solicitud:', error);
        if (error.status === 401) {
          console.warn('Token inválido o vencido. Redirigiendo al login...');
          localStorage.clear();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  };
  
  
