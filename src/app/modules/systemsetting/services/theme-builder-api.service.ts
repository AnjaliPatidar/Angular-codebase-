import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, mergeMap, retry, take} from 'rxjs/operators';
import {AppConstants} from '@app/app.constant';
import {GlobalConstants} from '@app/common-modules/constants/global.constants';
import {SharedServicesService} from '@app/shared-services/shared-services.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeBuilderApiService {
  private apiGateway = AppConstants.Theme_API;
  private uploadURL?: string;
  private themeKey?: string;
  public userID: string;
  constructor(private http: HttpClient, private sharedService: SharedServicesService) {}

  private presignedUrl(method: 'get' | 'put' | 'delete'): Observable<string> {
    // remove http protocol and last "/"
    const envFolder: string = AppConstants.Ehub_UI_API.replace(/^https?:\/\//, '');
    const userId = this.userID || GlobalConstants.ehubObject.userId;
    let s3ObjectMethod: string;
    switch (method) {
      case 'delete':
        s3ObjectMethod = 'deleteObject';
        break;
      case 'put':
        s3ObjectMethod = 'putObject';
        break;
      default:
        s3ObjectMethod = 'getObject';
    }
    return this.http
      .post<any>(this.apiGateway, {
        key: `${envFolder}${userId}/${this.themeKey}`,
        action: s3ObjectMethod,
      })
      .pipe(
        take(1),
        map((res) => {
          this.uploadURL = res;
          return res;
        }),
        retry(2),
        catchError(this.handleError)
      );
  }

  public uploadFile(data: Blob, key: string): Observable<any> {
    this.themeKey = key;
    return this.presignedUrl('put').pipe(
      mergeMap((url: string) => {
        return this.http.put(url, data);
      }),
      retry(2),
      catchError(this.handleError)
    );
  }

  public removeStyle(themeKey: string): Observable<any> {
    this.themeKey = themeKey;
    return this.presignedUrl('delete')
      .pipe(
        mergeMap((url: string) => {
          return this.http.delete(url);
        }),
        retry(2),
        catchError(this.handleError)
      );
  }

  public getStyle(themeKey: string, userId: string): Observable<string> {
    this.themeKey = themeKey;
    this.userID = userId;
    return this.presignedUrl('get').pipe(
      retry(2),
      catchError(this.handleError)
    );
  }


 private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    this.sharedService.showNewFlashMessage('something went wrong, try again later', 'danger');
    return throwError(
      () =>
        new Error(
          'Something bad happened with fileUploader; please try again later.'
        )
    );
  }
}
