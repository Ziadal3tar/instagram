import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  private redirecting = false;

  constructor(private router: Router, private readonly session: SessionService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.redirecting && !req.url.includes('/auth/')) {
          this.redirecting = true;
          this.session.clear();
          void this.router.navigate(['/login']).finally(() => {
            this.redirecting = false;
          });
        }
        return throwError(() => error);
      })
    );
  }
}
