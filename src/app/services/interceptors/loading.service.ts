import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoadingService } from '../loading/loading.service';
import { AuthGuardsService } from '../authGuards/auth-guards.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService,
     private router: Router,
     private authService: AuthGuardsService,
     private toasterservice:ToastrService
    
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // const token = localStorage.getItem('token');

    // if (token) {
    //   request = request.clone({
    //     setHeaders: {
    //       Authorization: `${token}` // Attach the JWT token
    //     }
    //   });
    // }

    request = request.clone({
    withCredentials: true
  });

    this.loadingService.show();  // Show loading spinner

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // If the server is down or there’s an error, navigate to 404
        if (error.status === 403) {

          let message = 'Please log in again to continue using the app.';

          if (error.error.message === 'Token expired due to 1-hour validity') {
            message = 'Your session has expired. Please log in again to continue using the app.';
          }
           else if (error.error.message === 'Token expired due to another active login') {
            message = 'Your session was terminated due to another active login. Please log in again.';
          }
  
          this.authService.sessionMessageSource.next(message); // Set the message
          this.router.navigate(['session-expired']);
          
        }
        else if (error.status === 404 || error.status === 500 ||
           error.status === 402 || error.status === 401 || error.status === 400 ) {
            this.toasterservice.error(error.error.message);
            this.toasterservice.error(error.error);
           }
        else {
          // this.router.navigate(['/404']); 
        }
        return throwError(error); // Re-throw the error after handling it
      }),
      finalize(() => this.loadingService.hide())  // Hide loading spinner
    );
  }
}
