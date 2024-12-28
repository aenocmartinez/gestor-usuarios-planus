import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token no disponible. Redirigiendo al login...');
      // Aquí puedes redirigir al login si el token no está disponible.
      window.location.href = '/login';
      throw new Error('Token no disponible. Inicie sesión nuevamente.');
    }
  
    const clonedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(clonedRequest);
  };
  
