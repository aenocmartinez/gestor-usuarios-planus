import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  return new Observable((observer) => {
    authService.getToken().then((token) => {
      console.log('Token enviado:', token); // Depurar el token
      const clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      console.log('Solicitud interceptada:', clonedReq);
      next(clonedReq).subscribe(observer);
    });
  });
}
