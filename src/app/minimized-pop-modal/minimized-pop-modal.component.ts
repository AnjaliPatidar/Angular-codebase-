import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedServicesService } from '@app/shared-services/shared-services.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-minimized-pop-modal',
  templateUrl: './minimized-pop-modal.component.html',
  styleUrls: ['./minimized-pop-modal.component.scss']
})
export class MinimizedPopModalComponent implements OnInit, OnDestroy {
  public enableDetailsView = true;
  public hideMiniMizeBody = false;
  public entitesCount: number = 0;
  public screeningResponse = {};
  public uploadScreenReasult: any = {};
  private unsubscribe$: Subject<any> = new Subject<any>();
  
  constructor(
    private _sharedServicesService: SharedServicesService,
  ) { }

  ngOnInit() {
    this.loadMaximizeData();
    this.screenCompletedData();
  }

  toogleDetails(){
    this.enableDetailsView = !this.enableDetailsView;
  }

  loadMaximizeData(){
    this._sharedServicesService.totalEntitesCount.pipe(takeUntil(this.unsubscribe$)).
    subscribe(res=>{
      this.entitesCount = res;
    })
  }

  viewDetails(){
    this._sharedServicesService.maxMinizedProcessingModal(false);
    this._sharedServicesService.getMinimizedPopValue(false);
  }

  screenCompletedData(){
    this._sharedServicesService.screeningCompleted$.pipe(takeUntil(this.unsubscribe$)).
    subscribe(res=>{
      this.screeningResponse = res;
      if (res['status']) {
        this.uploadScreenReasult = res['reasult'];
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
