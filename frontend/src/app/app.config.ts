import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import {provideToastr} from "ngx-toastr"
import { LoadingInterceptor } from './services/interceptors/loading.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), provideAnimationsAsync(), provideHttpClient(),provideToastr(),
     importProvidersFrom(HttpClientModule),LoadingInterceptor,
     {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},


    ]
};
