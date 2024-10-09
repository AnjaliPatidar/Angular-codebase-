import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ObserverService {

  constructor() { }
  public settingsSubject = new BehaviorSubject([]);
  public settingsObserver = this.settingsSubject.asObservable();
  emitSettingsData(data) {
    this.settingsSubject.next(data);
  }

  updateTable = new Subject<any>();
    public TableRender = this.updateTable.asObservable();
    updateUserTable(data: any) {
      this.updateTable.next(data);
    }

    assignedUserCount = new Subject<any>();
    public assignedUser = this.assignedUserCount.asObservable();
    setAssignedUserCount(data: any) {
      this.assignedUserCount.next(data);
    }
}
