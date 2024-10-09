import { ITMAlertCard } from './../models/alert-card.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionMonitoringService } from './../services/transaction-monitoring.service';
import { Component, OnInit } from '@angular/core';
import { catchError, filter, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { UtilitiesService } from '@app/modules/user-management/services/utilities/utilities.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-events',
  templateUrl: './alert-events.component.html',
  styleUrls: ['./alert-events.component.scss']
})
export class AlertEventsComponent implements OnInit {

  private readonly destroyed$: Subject<undefined> = new Subject<undefined>();

  alertId: number;
  alertCardData: ITMAlertCard;

  constructor(private tmService: TransactionMonitoringService, private route: ActivatedRoute, private utilService: UtilitiesService, private router: Router, private translateService: TranslateService) {
    // to force load component and invoke ngOnInit on params update.
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
      this.translateService.onLangChange.subscribe((res) => {
          this.route.url
              .pipe(
                  withLatestFrom(this.route.params), takeUntil(this.destroyed$),
                  map(([url, params]) => params['alertId']),
                  filter((alertId) => alertId !== null && alertId !== undefined),
                  tap((alertId) => this.alertId = alertId),
                  switchMap((alertId: number) => this.tmService.getAlertCard(String(alertId))),
                  map(response => ({...response, alertId: this.alertId})),
                  catchError(_ => {
                      this.utilService.openSnackBar("error", this.translateService.instant('Failed to get alert card data.'));
                      return of({} as ITMAlertCard);
                  })
              )
              .subscribe(response => {
                  this.alertCardData = response;
              });
      })
  }

}
