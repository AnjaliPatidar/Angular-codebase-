import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertManagementService } from '../../alert-management.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-adverse-media-metadata',
  templateUrl: './adverse-media-metadata.component.html',
  styleUrls: ['./adverse-media-metadata.component.scss']
})
export class AdverseMediaMetadataComponent implements OnInit {
  hitAdverseData: any = {};
  @Input('alertData') alertView;
  private _unsubscribe$ = new Subject<boolean>();
  isSuccess: string = ''
  showData: boolean = false
  constructor(private _alertService: AlertManagementService) { }

  ngOnInit() {
    this.getAdverseInformation()
  }

  getAdverseInformation() {
    this._alertService.getWatchlistData().pipe(takeUntil(this._unsubscribe$)).subscribe((data: any) => {
      if (data) {
        this.hitAdverseData = {
          title: data.name,
          confidenceLevel: this.getConfidencePercentage(data.confidence),
          classification: data.classifications,
          createdDate: data.created_date,
          classification_verfication: data.classification_verfication,
          status: data.status,
          hit_id: data.hit_id
        }
        this.showData = this.hitAdverseData.classification_verfication == 'none' ? false : true
        this.isSuccess = this.hitAdverseData.classification_verfication
      }
    })
  }

  getConfidencePercentage(num) {
    if (num && num <= 1) {
      num = parseFloat(num) * 100
      return num.toFixed(2);
    }
    return num;
  }

  classificationStatus(status: string) {
    if (this.hitAdverseData.classification_verfication == 'none') {
      let classificationObj = {
        hitId: this.hitAdverseData.hit_id,
        classificationVerification: status,
        uuid: this.alertView.uuid
      }

      this._alertService.updateAdverseClassification(classificationObj).pipe(takeUntil(this._unsubscribe$)).subscribe((res: any) => {
        if (res.status == 200) {
          this.showData = true
          this.isSuccess = status
        }
      })
    }
  }

  ngOnDestroy() {
    this._unsubscribe$.next(true);
    this._unsubscribe$.complete();
  }
}
