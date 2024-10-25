import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingService } from '../loading/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${token}` // Attach the JWT token
        }
      });
    }

    this.loadingService.show();  // Show loading spinner

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the server is down or there’s an error, navigate to 404
        if (error.status === 0 || error.status === 500 || error.status === 401) {
          console.log(error.status)
          if(error.error.message === 'Invalid Token'){
            console.log(error.error.message)
            this.router.navigate(['session-expired']);
          }else{
            this.router.navigate(['/404']);
          }
          
        }
        return throwError(error); // Re-throw the error after handling it
      }),
      finalize(() => this.loadingService.hide())  // Hide loading spinner
    );
  }
}
