import { Params } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConstants } from '@app/app.constant';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ITMAlertCard } from '../models/alert-card.model';
import { ITMAlertHit } from '../models/alert-hit.model';
import { ITMAlertHitTransaction } from '../models/alert-hit-transaction.model';

export interface ITMResponse {
}

@Injectable({
  providedIn: 'root'
})
export class TransactionMonitoringService {

  alertId: String;
  alertIdSub$: Observable<Params>;

  constructor(private httpClient: HttpClient) { }

  getAlertCard(alertId: string): Observable<ITMAlertCard> {
    var apiUrl = AppConstants.Ehub_Rest_API + "tm/alert-card"
    return this.httpClient.get<ITMAlertCard>(apiUrl, { params: { alertId } }).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getHits(alertId: number): Observable<ITMAlertHit[]> {
    const apiUrl = `${AppConstants.Ehub_Rest_API}tm/alert-card/hits?alertId=${alertId}`;
    return this.httpClient.get<ITMAlertHit[]>(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  getTransactionsOfAHit(hitId: string): Observable<ITMAlertHitTransaction[]> {
    var apiUrl = `${AppConstants.Ehub_Rest_API}tm/alert-card/hits/transactions?hitId=${String(hitId)}`
    return this.httpClient.get<ITMAlertHitTransaction[]>(apiUrl).pipe(
      retry(0),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      error.error.responseMessage ? error.error.responseMessage : 'Something bad happened; please try again later.');
  };
}
