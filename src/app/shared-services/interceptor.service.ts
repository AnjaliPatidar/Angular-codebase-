import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AppConstants } from '../app.constant'
import { Router } from '@angular/router';
import { WINDOW } from '../core/tokens/window';
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    @Inject(WINDOW) private readonly window: Window
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    let oldUrl: string = request.url;
    let newUrl: string;
    //  let exceptionUrls = [
    //    'http://localhost:4200/assets/i18n/en.json',
    //    'http://localhost:4200/assets/i18n/ge.json'
    //  ]
    if (!oldUrl.startsWith('http')) {
      newUrl = AppConstants.Ehub_Rest_API + oldUrl
    }
    else {
      newUrl = oldUrl;
    }
    if (newUrl.includes('.json')) {
      // request = request.clone({
      //   url: newUrl,

      // });
    } else {
      request = request.clone({
        url: newUrl,
        // setParams: {
        //   token: AppConstants.Ehubui_token
        // }

        setHeaders: {
          // 'Accept'       : 'application/json',
          'X-Auth-Token': AppConstants.Ehubui_token
        },
      });
    }
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (event.status === 401) {

          }
        }

      }, (err: HttpErrorResponse) => {
        if (err && err.status == 403) {
          this.router.navigate(['/element/forbidden']);
        }
        if (err && err.status == 401) {
          this.window.localStorage.removeItem('ehubObject');
          let paths: string = localStorage.getItem('paths');
          if (paths) {
            paths = JSON.parse(paths)
            this.window.location.href = paths['EHUB_API_LOGIN'];
          }
        }
      })
    );
  }
}
